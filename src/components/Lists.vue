<template>
    <div class="container">
        <div class="row topList">
            <!-- 左上方 -->
            <div v-for="(list, idx) in tempLists" class="col list" :key="list[idx]">
                <draggable
                    :list="list"
                    :group="{ name: 'cards', put: tempLists[idx].length === 0 }"
                >
                    <div v-for="card in list" :key="card" class="list-item">
                        <img
                            :src="require(`@/assets/cards/${getSuit(card)}-${getNum(card)}.png`)"
                            alt
                        />
                    </div>
                </draggable>
            </div>
            <!-- 右上方 -->
            <div v-for="(list, idx) in endLists" class="col list endList" :key="list[idx]">
                <draggable :list="list" :group="{ name: 'cards', put: endPut[idx] }">
                    <div v-for="card in list" :key="card" class="list-item">
                        <img
                            :src="require(`@/assets/cards/${getSuit(card)}-${getNum(card)}.png`)"
                            alt
                        />
                    </div>
                </draggable>
            </div>
        </div>

        <!-- 下方牌桌 -->
        <div class="row deskList">
            <div v-for="(list, idx) in lists" class="col list" :key="list[idx]">
                <draggable :list="list" :group="{ name: 'cards' }" draggable=".lastItem">
                    <div
                        v-for="(card, cardIdx) in list"
                        :key="card"
                        class="list-item"
                        :class="{ lastItem: cardIdx === list.length - 1 }"
                        @mousedown="setEndPut(card)"
                    >
                        <img
                            :src="require(`@/assets/cards/${getSuit(card)}-${getNum(card)}.png`)"
                            alt
                        />
                    </div>
                </draggable>
            </div>
        </div>

        <!-- list data -->
        <div v-show="debug" class="row displayList">
            <rawDisplayer class="col" :value="tempLists" title="tempLists" />
            <rawDisplayer class="col" :value="endLists" title="endLists" />
            <rawDisplayer class="col" :value="lists" title="Lists" />
        </div>
    </div>
</template>
<script>
import draggable from "vuedraggable";

export default {
    name: "Lists",
    components: {
        draggable
    },
    data() {
        return {
            debug: false,
            tempLists: [[], [], [], []],
            endLists: [[], [], [], []],
            lists: [],
            endPut: [false, false, false, false]
        };
    },
    computed: {
        // 取得1~52隨機數字
        randomCards() {
            let arr = [];
            let json = {};
            while (arr.length < 52) {
                let k = Math.floor(Math.random() * 52) + 1;
                if (!json[k]) {
                    json[k] = true;
                    arr.push(k);
                }
            }
            return arr;
        }
    },
    methods: {
        // 取得牌的數字
        getNum(id) {
            return id % 13 === 0 ? 13 : id % 13;
        },
        // 取得牌的花色
        getSuit(id) {
            if (id <= 13) {
                return 'diamond';
            }
            else if (id >= 14 && id <= 26) {
                return 'club';
            }
            else if (id >= 27 && id <= 39) {
                return 'spade';
            }
            else {
                return 'heart';
            }
        },
        // 將隨機數字拆分成8等分，顯示在牌桌上
        generateLists() {
            let start = 0;
            let end = start + 7;
            for (let i = 0; i < 8; i++) {
                this.$set(this.lists, i, this.randomCards.slice(start, end));
                start = end;
                end += i < 3 ? 7 : 6;
            }
        },
        // 選擇牌桌上的牌時，設定右上方是否可移入
        setEndPut(id) {
            let isNext = [];
            this.endLists.forEach((val, idx) => {
                let endNum = val.length === 0 ? 0 : this.getNum(val[val.length - 1]);
                isNext[idx] = this.getNum(id) - endNum === 1;
            });
            this.$set(this.endPut, 0, isNext[0] && id <= 13);
            this.$set(this.endPut, 1, isNext[1] && id >= 14 && id <= 26);
            this.$set(this.endPut, 2, isNext[2] && id >= 27 && id <= 39);
            this.$set(this.endPut, 3, isNext[3] && id >= 40);
        },
    },
    created() {
        this.generateLists();
    },
};
</script>

<style lang="scss">
.container {
    padding-top: 30px;
    padding-bottom: 162px;
}
.list > div {
    position: relative;
    min-height: 145px;
    width: 110px;
    border: 2px solid #ededed;
    border-radius: 10px;
    background-position: 50%;
    background-repeat: no-repeat;
}
.topList {
    margin-bottom: 20px;
    .list-item {
        position: absolute;
    }
}
.endList {
    @for $i from 5 through 8 {
        &:nth-of-type(#{$i}) > div {
            background-image: url("~@/assets/endList#{$i}.png");
        }
    }
}
.deskList {
    .list-item + .list-item {
        margin-top: -96px;
    }
}
.displayList {
    margin-top: 20px;
    color: #fff;
    pre {
        color: #fff;
    }
}
</style>
