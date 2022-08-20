// 使っていません

export const readCSV = function(filename) {    
    // CSVファイルを文字列として取得
    let srt = new XMLHttpRequest();

    srt.open("GET", filename, false);

    try {
        srt.send(null);
    } catch (err) {
        console.log(err)
    }

    // 配列を用意
    let csletr = [];

    // 改行ごとに配列化
    let lines = srt.responseText.split(/\r\n|\n/);

    // 表示
    // console.log(lines)

    // 1行ごとに処理
    for (let i = 0; i < lines.length; ++i) {
        let cells = lines[i].split(",");
        if (cells.length != 1) {
            csletr.push(cells);
        }
    }

    // 表示
    // console.log(csletr)

    return csletr;
}
