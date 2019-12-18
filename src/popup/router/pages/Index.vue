<template>
<el-container>
    <el-header>WATCHPLS</el-header>
    <el-main>
        <el-row>
            <el-col :span="24">
                <div class="grid-content bg-purple-dark">
                    <div style="margin-top: 15px;">
                        <el-input placeholder="Share link will appear here" v-model="input3">
                            <el-button slot="append" icon="el-icon-tickets"></el-button>
                        </el-input>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <div class="grid-content bg-purple-light">
                  <el-button v-bind:type="buttonType" v-on:click="shareButtonClicked">{{isStreaming ? "Stop" : "Start"}} Share</el-button>
                  Status: {{isStreaming ? "Sharing" : "Not Sharing"}}
                </div>
            </el-col>
        </el-row>
    </el-main>
</el-container>
</template>

<script>
import store from '../../../store'

export default {
    computed: {
      buttonType() {
        return this.$store.state.STREAM_STATUS ? "danger" : "success"
      },
      isStreaming() {
        return this.$store.state.STREAM_STATUS
      }
    },
    methods: {
      shareButtonClicked: function (event) {
        let STREAM_STATUS = this.$store.state.STREAM_STATUS
        chrome.runtime.sendMessage({type: "bglog", obj: "Stream status " + STREAM_STATUS})
        store.dispatch('setStreaming', !STREAM_STATUS)
      }
    }
};
</script>



<style>
.el-header {
    width: 500px;
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
    font-family: 'Roboto', sans-serif;
    font-size: 30px;
}

.el-aside {
    color: #333;
}

.el-row {
    margin-bottom: 20px;

    &:last-child {
        margin-bottom: 0;
    }
}

.el-col {
    border-radius: 4px;
}

.bg-purple-dark {
    background: #99a9bf;
}

.bg-purple {
    background: #d3dce6;
}

.bg-purple-light {
    background: #e5e9f2;
}

.grid-content {
    border-radius: 4px;
    min-height: 36px;
}

.row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
}
</style>

