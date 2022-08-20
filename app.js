// import { readCSV } from "./functions/readCSV.js";

/* 関数置く所 */

// 配列をランダムにして取得
// https://zenn.dev/k_kazukiiiiii/articles/cf3256ef6cbd84

const shuffleArray = (array) => {
    const cloneArray = [...array]

    for (let i = cloneArray.length - 1; i >= 0; i--) {
        let rand = Math.floor(Math.random() * (i + 1))
        // 配列の要素の順番を入れ替える
        let tmpStorage = cloneArray[i]
        cloneArray[i] = cloneArray[rand]
        cloneArray[rand] = tmpStorage
    }

    return cloneArray
}

// num だけ chemical_elements から選択する
const choice_elements = function(num, list){
    var choices = new Set();
    while (choices.size < num){
        choices.add(Math.floor(Math.random() * list.length));
    }
    var ret = [];
    for (let i = 0; i < list.length; i++){
        if (choices.has(i)){
        ret.push(i);
        }
    }
    // ! attention ! indexを返す
    return shuffleArray(ret);
};

const readCSV = function(filename) {    
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
    let elementsname = [];
    let actionname = [];

    // 改行ごとに配列化
    let lines = srt.responseText.split(/\r\n|\n/);

    // 1行ごとに処理
    for (let i = 0; i < lines.length; ++i) {
        let cells = lines[i].split(",");
        if (cells.length != 1) {
            csletr.push(cells);
        }
    }
    for (let i = 0; i < csletr.length; i++) {
        for (let j = 0; j < csletr[0].length; j++){
            if (i == 0 && j != 0){
                elementsname.push(csletr[i][j]);
            }
            if (i != 0 && j == 0){
                actionname.push(csletr[i][j]);
            }
        }
    }
    return [csletr, actionname, elementsname];
}

/*   main  */

// 初期化

// 元素を選択する
const [wholecells, actions, elements] = readCSV("./csv/chem.csv");
console.log(wholecells)
console.log(actions)
console.log(elements)
elementsIndex = choice_elements(5, elements);
console.log(elementsIndex)

let Voption = [];
for (let i = 0; i < actions.length; i++){
    Voption.push({text: actions[i], value: i+1});
}

let VChemicalItems = [];
for (let i = 0; i < elements.length; i++){
    VChemicalItems.push({element: elements[i], index: i+1});
}

let VAnswerItems = [];
for (let i = 0; i < elementsIndex.length; i++){
    VAnswerItems.push({element: elements[elementsIndex[i]], index: elementsIndex[i]+1});
}

// vue 本体

Vue.component('choices-content-name', {
    props: {
        ChemicalItem: { // テンプレート中ではケバブケース
          type: Object, // オブジェクトかどうか
          required: true // このコンポーネントには必須なのでtrue
        }
    },
    template: `<td>{{ ChemicalItem.element }}　</td>`
})

new Vue({
    el: "#app",
    data: { // dataプロパティ
        WholeData: wholecells,
        // {element, index}
        ChemicalItems: VChemicalItems,
        // {text, value}
        options: Voption,
        // {element. index}
        AnswerItems: VAnswerItems,
        AnswerId: [1, 1, 1, 1, 1],
        AnswerColor: ["white", "white", "white", "white", "white"],
        ResultItems: [],
        selected: 1,
        count: 0,
    },
    methods: {
        addResult: function (selected) {
            this.ResultItems.push({ action: this.options[selected-1].text,
                ion1: this.WholeData[selected][this.AnswerItems[0].index],
                ion2: this.WholeData[selected][this.AnswerItems[1].index],
                ion3: this.WholeData[selected][this.AnswerItems[2].index],
                ion4: this.WholeData[selected][this.AnswerItems[3].index],
                ion5: this.WholeData[selected][this.AnswerItems[4].index],});
                this.count++;
        },
        submitAnswer: function (){
            let cnt = 0;
            for (let i = 0; i < this.AnswerItems.length; i++){
                if (this.AnswerItems[i].index === this.AnswerId[i]){
                    cnt++;
                    this.AnswerColor[i] = "red";
                }else{
                    this.AnswerColor[i] = "blue";
                }
            }
            alert('正解数は' + cnt + '問です')
            // console.log(this.AnswerItems);
            // console.log(this.AnswerId);
            this.selected = 1;
        }
    },
})
