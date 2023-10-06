TYRANO.kag.freetext = {
    //任意のHTML内でメッセージ風に表示する関数群

    config : {
        is_showing_message: "false",
        ch_speed: 30,
    },

    //実際に表示する関数
    //message: string 表示するテキスト
    //area: string 表示領域 HTML要素を指定
    show_message: function(message = "テスト", area = "#freetext") {

        //メッセージ表示中
        this.config.is_showing_message = true

        //messageからHTMLを生成する
        const message_html = this.build_message_html(message)
        
        //生成したHTMLをspan.rowでラップする
        const message_row = $(`<span class="row">${message_html}</span>`)

        //既読色を反映
        if (TYRANO.kag.config.alreadyReadTextColor != "default") {
            message_row.css(
                "color",
                $.convertColor(
                    TYRANO.kag.config.alreadyReadTextColor,
                ),
            );
        }

        //任意のHTML要素の中に付け加える
        //div#freetext（任意のHTML要素）
        //  span.row（直前の[text]で表示した列）
        //      span あ
        //      span い
        //      span う
        //  span.row（今追加したmessage_row）
        //      span か
        //      span き
        //      span く

        $(area).append(message_row)

        this.add_charas(message_row);
    },

    //message からHTMLを生成する関数
    // 入力例) "かきく"
    // 出力例) "<span>か</span><span>き</span><span>く</span>"
    // 各<span>には opacity: 0; が適用されており透明な状態
    build_message_html: function(message){
        let message_html = ""

        for (let i = 0; i < message.length; i++) {
            // 1文字ずつ見ていく
            let c = message.charAt(i);

            message_html += `<span class="char" style="opacity:0">${c}</span>`;
        }

        return message_html;
    },

    //文字を追加していく
    //message: jQuery 表示メッセージの一文字一文字をラップしている親span要素のjQueryオブジェクト
    add_charas : function(message) {
        // 文字の表示速度 (単位はミリ秒/文字)
        let ch_speed = 30;

        if (TYRANO.kag.stat.ch_speed !== "") {
            ch_speed = parseInt(TYRANO.kag.stat.ch_speed);
        } else if (TYRANO.kag.config.chSpeed) {
            ch_speed = parseInt(TYRANO.kag.config.chSpeed);
        }

        // 1文字1文字の<span>要素のjQueryオブジェクトのコレクション
        const char_childrens = message.find(".char");

        // すべてのテキストを一瞬で表示すべきなら全部表示してさっさと早期リターンしよう
        // 次のいずれかに該当するならすべてのテキストを一瞬で表示すべきである
        // （- スキップモード中である）
        // （- [nowait]中である）
        // - 1文字あたりの表示時間が 3 ミリ秒以下である
        //※ティラノ内ではなく任意のHTML内で使うなら三番目だけを考慮すればよい。

        if (ch_speed <= 3) {
            // 全文字表示
            char_childrens.setStyleMap({
                animation: "",
                visibility: "visible",
                opacity: "1",
            });
        }

        // ここまで来たということは1文字ずつ追加していくということ

        //文字表示速度
        this.config.ch_speed = ch_speed

        // 1文字目を追加 あとは関数内で再帰して表示
        this.add_char(0, char_childrens);

    },

    //文字を追加していく（一文字ずつ）
    //char_index: number 表示する文字のインデックス
    //char_childrens: jQuery 1文字1文字の`<span>`のjQueryオブジェクトのコレクション
    add_char: function(char_index, char_childrens) {

        char_childrens.eq(char_index).setStyleMap({
            visibility: "visible",
            opacity: "1" 
        });

        // 次の文字のインデックス
        const next_char_index = char_index + 1;

        
        // すべての文字を表示し終わったかどうか
        if (next_char_index < char_childrens.length) {
            // まだ表示していない文字があるようだ
            // タイムアウトを設けて次の文字を表示しよう
            $.setTimeout(() => {
                this.add_char(next_char_index, char_childrens);
            }, this.config.ch_speed);
        } else {
            // すべての文字を表示し終わったようだ
            $.setTimeout(() => {
                //メッセージ表示終了
                this.config.is_showing_message = false
            }, this.config.ch_speed);
        }

    },

    //メッセージ消去。ティラノで言うp、cm。
    //area: string メッセージを消去するHTML要素を指定。
    clear_message: function(area = "#freetext") {

        //関係無いHTML要素は消さないように、freetext特有の要素を持つHTML要素のみ初期化
        if ($(area).find("span.row").length > 0) {
            $(area).html("")
        }
    },
    
}
