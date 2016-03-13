import request from 'request-promise';

export async function searchImages(term){
  const result = await request(`https://registry.hub.docker.com/v1/search?q=${encodeURIComponent(term)}&n=5`);
  return JSON.parse(result);
};

export async function searchImageTags(term){
  const result = await request(`https://registry.hub.docker.com/v1/repositories/${term}/tags`);
  return JSON.parse(result);
};
