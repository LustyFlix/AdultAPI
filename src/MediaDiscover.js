import { detailsBase } from "./constants.js";

export async function getVideoDiscover(with_genres, pageNo) {
    try {
    	const page = pageNo || 1;
        const url = 'https://www.eporner.com/cat/' + with_genres + '/' + page + '/';

        const response = await fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml"
            }
        });
        const html = await response.text();
        
        console.log(html);

        // Extract items
        const items = [];
        const itemRegex = /<div class="mbcontent">([\s\S]*?)<\/div>/g;

        for (const block of html.matchAll(itemRegex)) {
            const content = block[1];

            items.push({
                id: content.match(/video-(.*?)\//)?.[1] || null,
                title: content.match(/alt="(.*?)"/)?.[1] || null,
                poster_path: content.match(/<img src="(.*?)"/)?.[1] || null,
                vote_count: content.match(/<span class="mbvie" title="Views">(.*?)</)?.[1] || null
            });
        }

        // Pagination (assumes 69 items per page)
        const total_results = Number(html.match(/<li class="activecat"><div><a href=".*?"><span class="catname">All<\/span><\/a> <div class="cllnumber" title="Videos count">(.*?)<\/div><\/div><\/li>/)?.[1]?.replace(/,/g, ""));
        const total_pages = Math.ceil(total_results / 69);

        // Final response
        const discover = {
            page,
            results: items,
            total_pages,
            total_results
        };

        return discover;
    } catch (err) {
        console.error(err);
        return null;
    }
}