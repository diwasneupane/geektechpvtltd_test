export function http(path, options = {}) {
  if (!options.headers) {
    options.headers = {};
  }

  if (options.body) {
    options.body = JSON.stringify(options.body);
  }

  options.headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...options.headers,
  };

  const url = import.meta.env.VITE_API_URL + path;

  return fetch(url, options)
    .then((res) => {
      if (!res.ok) {
        throw res;
      }

      return res.json();
    })
    .catch(async (err) => {
      if (err instanceof Response) {
        const error = new Error();

        error.response = await err.json();

        throw error;
      }

      throw err;
    });
}
