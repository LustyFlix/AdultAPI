import { detailsBase } from "./constants.js";

export async function getVideoDetails(Id, thumbsize) {
    try {
        let url = detailsBase + Id;

        if (thumbsize === "small" || thumbsize === "medium" || thumbsize === "big") {
            url += `&thumbsize=${thumbsize}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        // Fix genres: convert string → array
        const genres = data.keywords
            .split(",")                 // split comma
            .map(k => k.trim())         // remove spaces
            .filter(k => k.length > 0); // remove empty values

        // Fix runtime (convert seconds → minutes)
        const runtime = Math.floor(data.length_sec / 60);

        const json = {
            adult: true,
            backdrop_path: data.default_thumb.src,
            genres: genres,
            id: data.id,
            title: data.title,
            poster_path: data.default_thumb.src,
            release_date: data.added,
            runtime: runtime,
            vote_average: Number(data.rate),
            vote_count: data.views
        };

        return { json };

    } catch (err) {
        console.error(err);
        return null;
    }
}
