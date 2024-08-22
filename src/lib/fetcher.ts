export const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
      const errorData = await res.text();
      try {
        const parsedErrorData = JSON.parse(errorData);
        throw new Error(`HTTP error ${res.status}: ${parsedErrorData.message}`);
      } catch (e) {
        throw new Error(`HTTP error ${res.status}: ${errorData}`);
      }
    }
    const data = await res.json();
    return data;
  };