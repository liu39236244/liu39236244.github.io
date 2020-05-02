# 这里记录了 js 中return 中的记录


## return 是否继续执行

### 普通代码块
```
如果一片代码块中
{
    A
    {
        B：如果这里-  return/return false ；则B以后都不会不会执行
        如果这里return true ，则B以后都是会继续执行
    }
    B
    A: 这里 
        return ;
        return true;
        return false;
    不用想，肯定不执行 C
    C :alert(1)
}
```

### 循环代码块


如果是循环中



```
javascript 中的循环
lon_split.forEach(function (element) {
        if(!element.trim()){
            
            // continue; // 这里使用return true ；替代coninue 
        }
        alert("当前判断"+element)
        if((re.test(element))==false){
            flag=false;
            // break;
        }
    })

    //
    alert("纬度格式通过")

经测试forEach中没有continue 与 break，那么怎么解决呢

有两种方式，最好用jquery中的each ，虽然都没有break 与continue 但是，
jquery 中的each 可以跳出循环，即  reurn true 代表continue，return false d代表break
```