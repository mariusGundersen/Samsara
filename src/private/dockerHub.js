import request from "request-promise";

export async function searchImages(term) {
  return await requestJson(
    `https://registry.hub.docker.com/v1/search?q=${encodeURIComponent(
      term
    )}&n=5`
  );
}

export async function searchImageTags(term = "") {
  if (!term.includes("/")) {
    term = "library/" + term;
  }
  let data = await requestJson(
    `https://hub.docker.com/v2/repositories/${term}/tags`
  );
  let list = data.results;
  while (data.next) {
    data = await requestJson(data.next);
    list = list.concat(data.results);
  }
  return list;
}

async function requestJson(url) {
  const result = await request(url);
  return JSON.parse(result);
}
