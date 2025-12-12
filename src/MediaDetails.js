import { detailsBase } from "./constants.js";

let url = 'null';

export async function getVideoDetails(Id, thumbsize) {
    try {
        if (thumbsize === 'small' || thumbsize === 'medium' || thumbsize === 'big') {
            url = detailsBase + Id + '&thumbsize=' + thumbsize;
        } else {
            url = detailsBase + Id;
        }

        const response = await fetch(url);
        const data = await response.json();

        const json = {
            adult: true,
            backdrop_path: data.default_thumb.src,
            genres: data.keywords,
            id: data.id,
            title: data.title,
            poster_path: data.default_thumb.src,
            release_date: data.added,
            runtime: data.length_min,
            vote_average: data.rate,
            vote_count: data.views  
        };
        return { json };
    } catch (err) {
        console.error(err);
        return null;
    }
}
