export default function streamToString(stream){
  return Promise.resolve(stream).then(stream => new Promise(function(resolve, reject){
    let result = ''
    stream.on('data', function(chunk){
      result += chunk.toString('utf8');
    });

    stream.on('end', function(){
      resolve({__html: result, toString: () => result, valueOf: () => result});
    });

    stream.on('error', reject);
  }));
};