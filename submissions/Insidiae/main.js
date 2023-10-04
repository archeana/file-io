async function challenge() {
  const dataset = await d3.csv("./spotify-2023.csv", (row) => {
    return {
      trackName: row["track_name"],
      artistsName: row["artist(s)_name"].split(", "),
      artistCount: +row["artist_count"],
      releasedYear: +row["released_year"],
      releasedMonth: +row["released_month"],
      releasedDay: +row["released_day"],
      //? For most of these numeric columns,
      //? we simply automagically set empty values to 0 when casting
      inSpotifyPlaylists: +row["in_spotify_playlists"],
      inSpotifyCharts: +row["in_spotify_charts"],
      streams: +row["streams"],
      inApplePlaylists: +row["in_apple_playlists"],
      inAppleCharts: +row["in_apple_charts"],
      inDeezerPlaylists: +row["in_deezer_playlists"],
      inDeezerCharts: +row["in_deezer_charts"],
      inShazamCharts: +row["in_shazam_charts"],
      bpm: +row["bpm"],
      key: row["key"] || "Unknown",
      mode: row["mode"],
      danceabilityPercent: +row["danceability_%"],
      valencePercent: +row["valence_%"],
      energyPercent: +row["energy_%"],
      acousticnessPercent: +row["acousticness_%"],
      instrumentalnessPercent: +row["instrumentalness_%"],
      livenessPercent: +row["liveness_%"],
      speechinessPercent: +row["speechiness_%"],
    };
  });

  // console.log(dataset);

  //* 1. Identify the number of songs in the file
  d3.select(".song-count").text(dataset.length);

  //* 2. Identify the number of songs in the key of E
  function getKeyCount(dataset, key) {
    return dataset.filter((d) => d.key === key).length;
  }

  d3.select(".song-key-count").text(getKeyCount(dataset, "E"));

  //* 3. Count the occurrences of values in a specified column
  //* (e.g., artist names) and determine the most common value.
  function getTableRows(dataset, column = "artist(s)_name") {
    const frequencyTable = {};

    for (let row of dataset) {
      if (column === "artist(s)_name") {
        for (let artist of row.artistsName) {
          frequencyTable[artist] = (frequencyTable[artist] || 0) + 1;
        }
      } else {
        frequencyTable[row[column]] = (frequencyTable[row[column]] || 0) + 1;
      }
    }

    return Object.entries(frequencyTable).sort((d1, d2) => d2[1] - d1[1]);
  }

  const tableRows = getTableRows(dataset);
  const table = d3.select("#challenge-3");

  const columns = [
    { label: "Artist", type: "text", format: (d) => d[0] },
    { label: "Frequency", type: "number", format: (d) => d[1] },
  ];

  table
    .append("thead")
    .append("tr")
    .selectAll("thead")
    .data(columns)
    .join("th")
    .text((d) => d.label)
    .attr("class", (d) => d.type);

  const body = table.append("tbody");

  tableRows.forEach((d) => {
    body
      .append("tr")
      .selectAll("td")
      .data(columns)
      .join("td")
      .text((column) => column.format(d))
      .classed("top-count", d[1] === tableRows[0][1]);
  });
}

challenge();
