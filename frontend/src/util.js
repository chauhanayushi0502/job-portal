const apiKey = import.meta.env.VITE_SERVER_URL;

export const getFetchUrl = (url) => {
   return `${apiKey}/${url}`
}