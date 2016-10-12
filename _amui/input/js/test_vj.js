var m_test, v_test, c_test;
/*
<div class="vj-ctrl vj-check-bool"></div>

*/
m_test = {
    inputs: {
        TYPE: Object,
        REQUIRED: true,

        input: {
            TYPE: "str",
            LEN: [0, 18],
            CTRL: "INPUT",
            FORMAT: "price",
            NUMERIC: true,

            INPUT: {
                TITLE: "普通",
                STYLE: "width: 120px",
                INPUT: "textarea",

                PLACEHOLDER: "price name",
                COUNTER: "0/6",

                DESC: "hello world!"
            }
        },


        input_2 : {
            TYPE: "str",
            CTRL: "INPUT",

            INPUT: {
                CLASS: "vj-mutiple",
                TITLE: "多字段",
                COUNTER: "0/5",
                INPUT: "input",
                STYLE: "width: 120px",
                ITEM: {
                    first_name: {
                        PLACEHOLDER: "first_name"
                    },
                    last_name: {
                        PLACEHOLDER: "last_name",
                        STYLE: "width:160px;"
                    },

                }
            }
        }
    },
    selectors: {
        TYPE: Object,
        REQUIRED: true,

        select_text: {
            CTRL: "SELECT",

            SELECT:{
                CLASS: "vj-select-text",
                TITLE: "类型",

                DESC: "选择类型的描述",
                TEXT: "选择类型",
                VIEWER: "",
            },
            ITEM: {
                option_a: "A",
                option_b: "B",
                option_c: "C",
                option_d: "D",
                option_e: "E",
                option_f: "F",
                option_g: "G"
            }
        },
        select_matrix: {
            CTRL: "SELECT",

            SELECT:{
                CLASS: "vj-select-matrix",
                TITLE: "颜色",

                DESC: "选择颜色的描述",
                TEXT: "选择颜色",
                VIEWER: 1,

                ITEM_ATTR: "data-bgcolor"

            },
            ITEM: {
                Color010: "Color010",
                Color020: "Color020",
                Color030: "Color030",
                Color040: "Color040",
                Color050: "Color050",
                Color060: "Color060",
                Color070: "Color070",
                Color080: "Color080",
                Color081: "Color081",
                Color082: "Color082",
                Color090: "Color090",
                Color100: "Color100",
                Color101: "Color101",
                Color102: "Color102"
            }
        },

        check_single: {
            CTRL: "CHECK",
            CHECK: {
                CLASS: "vj-check-radio",
                TITLE: "多项单选",

                DESC: "只能选一项 <br> check_single: \"option_x\"",
                TEXT: "TEXT",
                VIEWER: "VIEWER",


            },
            ITEM: {
                option_a: "A",
                option_b: "B",
                option_c: "C"
            }
            // check_single: "option_a"
        },

        check_mutiple: {
            CTRL: "CHECK",
            CHECK: {
                CLASS: "vj-check-box",
                TITLE: "多项选择",

                DESC: "可以选多项 <br> check_single:[ \"option_a\", \"option_b\"]",

            },
            ITEM: {
                option_a: "A",
                option_b: "B",
                option_c: "C"
            }

            // check_mutiple : ["option_a","option_b"]
        },

        check_bool: {
            CTRL: "CHECK",
            CHECK: {
                CLASS: "vj-check-box vj-boolean",
                TITLE: "单项布尔值",

                DESC: "布尔值 <br> check_bool_box:",

            },
            BOOL: [ "每次收费" ]
            // 如果是单项必须用数组，不然无法编译模板
            // check_bool : true/false
            // 
        },
        check_bool_single: {
            CTRL: "CHECK",
            CHECK: {
                CLASS: "vj-check-radio vj-boolean",
                TITLE: "多项单选布尔值",

                DESC: "布尔值",

            },
            BOOL: {
                at_key :"用key配对",
                at_name :"用name配对"
            }
            // check_bool : true/false
            // 
        },
        check_bool_mutiple: {
            CTRL: "CHECK",
            CHECK: {
                CLASS: "vj-check-box vj-boolean",
                TITLE: "布尔值多选",

                DESC: "布尔值",

            },
            BOOL: {
                at_mon :"星期一",
                at_tue :"星期二"
            }
            // check_bool : true/false
            // 
        },
    }

}
