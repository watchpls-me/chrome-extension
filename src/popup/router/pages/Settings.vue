<template>
    <el-container>
        <el-header>
            <el-row>
                <el-col :span="12">
                    <span>Settings</span>
                </el-col>
                <el-col style="text-align: right; font-size: 12px" :span="12">
                    <el-button @click.stop="closeSettings" type="primary" icon="el-icon-check" circle/>
                </el-col>
            </el-row>
        </el-header>
        <el-main>
            <el-col>
                <el-form ref="form">
                    <el-form-item label="Resolution">
                        <el-select v-model="settings.resolution" placeholder="Select a resolution">
                            <el-option
                                    v-for="item in resolutions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Frame rate">
                        <el-select v-model="settings.framerate" placeholder="Select a frame rate">
                            <el-option
                                    v-for="item in framerates"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <span>* Streams are relayed via P2P. Quality choice is dependent on your bandwidth</span>
            </el-col>
        </el-main>
    </el-container>
</template>

<script>
  export default {
    name: 'Settings',
    data: () => ({
      settings: {},
      resolutions: [{
        value: null,
        label: 'Fit screen'
      }, {
        value: 1440,
        label: '1440p'
      }, {
        value: 1080,
        label: '1080p'
      }, {
        value: 720,
        label: '720p'
      }, {
        value: 480,
        label: '480p'
      }],
      framerates: [{
        value: 60,
        label: '60 fps'
      }, {
        value: 30,
        label: '30 fps'
      }, {
        value: 20,
        label: '20 fps'
      }],
    }),
    methods: {
      closeSettings () {
        this.$store.dispatch('setSettings', this.settings)
        this.$router.push({ name: 'index' })
      }
    },
    beforeMount () {
      this.settings = {
        resolution: this.$store.state.resolution,
        framerate: this.$store.state.framerate
      }
    }
  }
</script>

<style scoped>

</style>