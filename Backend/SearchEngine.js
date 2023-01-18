const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200', auth: {username: 'elastic',password: 'your elastic password'}});

const SrcmetaphorSearch = async (phrase) => {
  var size = 50;
  
  const searchResult = await client
    .search({
      index: "sinhala-songs",
      _source_includes:"singer,lyricist,composer,year,lyrics",
      body: {
        size: size,
        query: {
          nested: {
            path: "metaphors",
            query: {
              match: { "metaphors.source_domain": phrase }
            },
            inner_hits: { 
            }
          }
        },
      },
    })


    console.log(searchResult.hits.hits.length)

  return {
    success: 1,
    data:searchResult,
  };
};

const SrcmetaphorSearchWithType = async (phrase,type) => {
  const hits = [];
  var size = 50;

  const searchResult = await client
    .search({
      index: "sinhala-songs",
      _source_includes:"singer,lyricist,composer,year,lyrics",
      body: {
        size: size,
        query: {
          nested: {
            path: "metaphors",
            query: {
              bool: {
                must: [
                  { match: { "metaphors.source_domain": phrase }},
                  { match_phrase: { "metaphors.type":  type}} 
                ]
              }
            },
            inner_hits: { 
            }
          }
        },
      },
    })

  return {
    success: 1,
    data:searchResult,
  };
};

const TgtmetaphorSearch = async (phrase) => {
  const hits = [];
  var size = 50;

  const searchResult = await client
    .search({
      index: "sinhala-songs",
      _source_includes:"singer,lyricist,composer,year,lyrics",
      body: {
        size: size,
        query: {
          nested: {
            path: "metaphors",
            query: {
              match: { "metaphors.target_domain": phrase }
            },
            inner_hits: { 
            }
          }
        },
      },
    })

  return {
    success: 1,
    data:searchResult,
  };
};

const TgtmetaphorSearchWithType = async (phrase,type) => {
  const hits = [];
  var size = 50;
  
  const searchResult = await client
    .search({
      index: "sinhala-songs",
      _source_includes:"singer,lyricist,composer,year,lyrics",
      body: {
        size: size,
        query: {
          nested: {
            path: "metaphors",
            query: {
              bool: {
                must: [
                  { match: { "metaphors.target_domain": phrase }},
                  { match_phrase: { "metaphors.type":  type}} 
                ]
              }
            },
            inner_hits: { 
            }
          }
        },
      },
    })

  return {
    success: 1,
    data:searchResult,
  };
};

const SrcAutoComplete = async (phrase) => {
  const hits = [];
  // only string values are searchable
  const searchResult = await client
    .search({
      index: "sinhala-songs",
      _source_includes:"singer,lyricist,composer,year,lyrics",
      body: {
        query: {
          nested: {
            path: "metaphors",
            query: {
              match_bool_prefix: { "metaphors.source_domain": phrase }
            },
            inner_hits: { 
            }
          }
        },
      },
    })

    if (searchResult.hits.total.value<1){
      out={
        success: 1,
        data:[],
      };
    }
    else{
      out_list=[];
      obj_list=searchResult.hits.hits;

      for (let i = 0; i < obj_list.length; i++) {
        obj=obj_list[i];
        met_obj=obj.inner_hits.metaphors.hits.hits[0];
        out_list.push(met_obj._source.source_domain);
      }
      uniqe_list=[... new Set(out_list)]
      out={
        success: 1,
        data:uniqe_list,
      };
    }
  return out;
};

const TgtAutoComplete = async (phrase) => {
  const hits = [];
  // only string values are searchable
  const searchResult = await client
    .search({
      index: "sinhala-songs",
      _source_includes:"singer,lyricist,composer,year,lyrics",
      body: {
        query: {
          nested: {
            path: "metaphors",
            query: {
              match_bool_prefix: { "metaphors.target_domain": phrase }
            },
            inner_hits: { 
            }
          }
        },
      },
    })

    if (searchResult.hits.total.value<1){
      out={
        success: 1,
        data:[],
      };
    }
    else{
      out_list=[];
      obj_list=searchResult.hits.hits;

      for (let i = 0; i < obj_list.length; i++) {
        obj=obj_list[i];
        met_obj=obj.inner_hits.metaphors.hits.hits[0];
        out_list.push(met_obj._source.target_domain);
      }
      uniqe_list=[... new Set(out_list)]
      out={
        success: 1,
        data:uniqe_list,
      };
    }
  return out;
};



module.exports = {
  SrcmetaphorSearch,
  SrcmetaphorSearchWithType,
  TgtmetaphorSearch,
  TgtmetaphorSearchWithType,
  SrcAutoComplete,
  TgtAutoComplete

};