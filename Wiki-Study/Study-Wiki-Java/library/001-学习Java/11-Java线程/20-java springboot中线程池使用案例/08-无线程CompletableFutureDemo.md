#  CompletableFuture.allOf 无线程池多线程执行代码案例


## 在程序中使用多个线程并行执行多个方法，并且等待执行完毕再往下执行，这是看到同事这样写感觉这种写法挺好，就记下来；

**注意 join的话会导致主方法等待创建的线程执行完毕才会继续执行，如果是创建线程一直循环执行的场景， 千万不要加join**

```
 CompletableFuture.allOf(
    CompletableFuture.runAsync(() -> {
        // 监测总览探头数据计算-->健康度
        calculateMethod1(map, bridgeDeviceSensorProbeListMap, listByBridgeId2, listByBridgeId3);
    }, ForkJoinPool.commonPool()),
    CompletableFuture.runAsync(() -> {
        // 监测总览探头数据计算-->环境、作用
        calculateMethod2(map, listByBridgeId2, listByBridgeId3);
    }, ForkJoinPool.commonPool()),
    CompletableFuture.runAsync(() -> {
        // 监测总览探头数据计算-->结构响应
        calculateMethod3();
    }, ForkJoinPool.commonPool()),
    CompletableFuture.runAsync(() -> {
        // 监测总览探头数据计算-->结构变化
        calculateMethod4();
    }, ForkJoinPool.commonPool())
).join();

```


## 案例2 自定义线程池执行

```java
@Test
    public void Test31(){
        // 1. 创建线程池

        int threadNum = Runtime.getRuntime().availableProcessors();
        // ThreadPoolExecutor threadPoolExecutor=new ThreadPoolExecutor(5, 10, 30, TimeUnit.SECONDS, new ArrayBlockingQueue<>(100));
        ExecutorService executorService = Executors.newFixedThreadPool(threadNum);

        List<Integer> list = Arrays.asList(1, 2, 3);
        // 2. 提交任务，并调用join()阻塞等待所有任务执行完成
        CompletableFuture
                .allOf(
                        list.stream().map(key ->
                                CompletableFuture.runAsync(() -> {
                                    // 睡眠一秒，模仿处理过程
                                    try {
                                        Thread.sleep(1000L);
                                    } catch (InterruptedException e) {
                                    }
                                    System.out.println("关注微信公众号Java编程Code,获取更多学习资料" + key);
                                }, executorService))
                                .toArray(CompletableFuture[]::new))
                .join();
        executorService.shutdown();
    }

```


## 案例三

```java
ExecutorService pool = Executors.newFixedThreadPool(1000);

CompletableFuture[] futureList = list.parallelStream().map(item-> CompletableFuture.supplyAsync(() -> {
            for(int i=0;i<24;i++){
                for(int j=0;j<count;j++){
                    List<ElectricModel> device_info = new ArrayList<>();

                    Timestamp upload_time = new Timestamp(item + i*3600000 + (long) (Math.random()*57*60*1000));
                    Timestamp gather_time = upload_time;
                    DeviceProtocol deviceProtocol = new DeviceProtocol();
                    deviceProtocol.setTenant_id(tenant_id);
                    deviceProtocol.setServer_id(server_id);
                    deviceProtocol.setUpload_time(upload_time);
                    deviceProtocol.setPrj_id(prj_id);
                    for (String device_id : getDevices()) {
                        ElectricModel model=new ElectricModel();
                        model.setDevice_id(device_id);
                        model.setGather_time(gather_time);
                        model.setDevice_path(device_path);
                        model.setState(0);
                        model.setElectric_meter(createElectricMeter(device_id,gather_time.getTime()));

                        if(getDuanluqiDevices().contains(device_id)){
                            model.setEpt_stat(createDeviceStateParam(device_id));
                        }

                        device_info.add(model);
                    }


                    deviceProtocol.setDevice_info(device_info);

                    //todo kafka send msg
                    sendMsg(deviceProtocol);
                }
            }
            System.out.println(new Timestamp(item)+"任务完成");
            return item;
        }, pool)
        .whenComplete((s,e)->{

        })
).toArray(CompletableFuture[]:: new);
//所有任务执行完才放行
CompletableFuture.allOf(futureList).join();
//关闭线程池
pool.shutdown();

```
