# input 控制


```

<el-input
            class="verification-input"
            v-model.number="verificationVal"
            :maxlength="6"
            size="small"
            @input.native="inputhandle">
</el-input>


  inputhandle({ target }) {
    this.verificationVal = target.value = target.value.replace(/[^0-9]/g, "");
  }

```