// this file is intended to export db contents in format of json

import {readFile, appendFile} from "fs/promises"

function extractTrackInfo(data) {
    return {
        previewUrl: data.preview_url,
        albumCover: data.album.images[0].url,
        name: data.name,
        artist: data.artists[0].name,
        popularity: data.popularity,
        year: parseInt(data.album.release_date.substring(0, 4)),
        album: data.album.name,
        duration: data.duration_ms,
    }
}

function buildSQL(data) {
    const escape = (str) => (str || '').replace(/'/g, "''");
    const previewUrl = data.previewUrl ? `'${escape(data.previewUrl)}'` : 'NULL';
    const albumCover = `'${escape(data.albumCover)}'`;
    const name = `'${escape(data.name)}'`;
    const artist = `'${escape(data.artist)}'`;
    const album = `'${escape(data.album)}'`;

    return `INSERT INTO \`collections\` (\`preview_url\`, \`album_cover\`, \`name\`, \`year\`, \`artist\`, \`popularity\`, \`album\`, \`duration\`) VALUES (${previewUrl}, ${albumCover}, ${name}, ${data.year}, ${artist}, ${data.popularity}, ${album}, ${data.duration});`;
}

async function generate() {
    try {
        const fileContent = await readFile('./dataset-4.json', 'utf8')
        const data = JSON.parse(fileContent)

        for (const item of data) {
            const record = extractTrackInfo(item)
            const sqlStatement = buildSQL(record)
            await appendFile('seed-2.sql', sqlStatement + '\n', 'utf8');
        }
    } catch (e) {
        console.error(e)
    }
}

generate()
