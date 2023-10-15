const clientFetcher = async (url: string, options: RequestInit = {}) => {
    const fullUrl = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/${url}`;
    const response = await fetch(fullUrl, options);
    if (response.ok) {
        let data = null;
        try {
            data = await response.json();
        } catch (error) {
            console.error('Error while parsing response:', error);
        }
        return { data, status: response.status }
    }
    return {
        data: null,
        status: response.status,
        error: response.statusText
    }
}

export default clientFetcher;
