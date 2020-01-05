<template>
    <el-container>
        <el-header>
            <el-row>
                <el-col :span="12">
                    <span>WatchPls</span>
                </el-col>
                <el-col style="text-align: right; font-size: 12px" :span="12">
                    <el-button @click.stop="$router.push({ name: 'settings' })" type="primary" icon="el-icon-setting" circle/>
                </el-col>
            </el-row>
        </el-header>
        <el-main>
            <el-row>
                <el-col :span="24">
                    <div class="grid-content bg-purple-dark">
                        <div style="margin-top: 15px;">
                                <el-input ref="streamLink" placeholder="Share link will appear here" :value="shareLink">
                                    <el-tooltip :disabled="!$store.state.SHARE_LINK" slot="append" :content="tooltip" placement="top">
                                        <el-button :disabled="!$store.state.SHARE_LINK" icon="el-icon-tickets" @click="copyLink"></el-button>
                                    </el-tooltip>
                                </el-input>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <div class="grid-content bg-purple-light">
                        <el-button v-bind:type="buttonType" v-on:click="shareButtonClicked">{{isStreaming ? 'Stop' :
                            'Start'}} Share
                        </el-button>
                        Status: {{isStreaming ? 'Sharing' : 'Not Sharing'}}
                    </div>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>

<script>
  import store from '../../../store'

  export default {
    data: () => ({
      tooltip: 'Click to copy link'
    }),
    computed: {
      buttonType () {
        return this.$store.state.STREAM_STATUS ? 'danger' : 'success'
      },
      isStreaming () {
        return this.$store.state.STREAM_STATUS
      },
      shareLink () {
        return this.$store.state.SHARE_LINK
      }
    },
    methods: {
      shareButtonClicked (event) {
        if (!this.$store.state.STREAM_STATUS)
          chrome.runtime.sendMessage({ type: 'startStream' }, function (e) {console.log(e)})
        else
          chrome.runtime.sendMessage({ type: 'endStream' }, function () {console.log('done')})
      },
      copyLink () {
        const input = this.$refs.streamLink
        input.focus()
        document.execCommand('selectAll')
        const copied = document.execCommand('copy')
        if (copied) {
          this.tooltip = 'Link copied!'
          setTimeout(() => {
            this.tooltip = 'Click to copy link'
          }, 2000)
        }
      }
    }
  }
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

    &
    :last-child {
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

