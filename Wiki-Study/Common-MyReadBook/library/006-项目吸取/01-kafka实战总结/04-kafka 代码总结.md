# zookeeper

## zookeeper

## 生产者生产数据



### 利用单例模式创建一个 producer 生产者

```Java
public static synchronized KafkaProducer getInstance(String brokerList) {
     if (instance == null) {
       instance = new KafkaProducer(brokerList);
       System.out.println("初始化 kafka producer...");
     }
     return instance; // 注意这里的instance是KafkaProducer 类型
   }

```

###  producer 生产者生产数据
```Java
private static final long serialVersionUID = 1L;
	public static final String METADATA_BROKER_LIST_KEY = "metadata.broker.list";
	  public static final String SERIALIZER_CLASS_KEY = "serializer.class";
	  public static final String SERIALIZER_CLASS_VALUE = "kafka.serializer.StringEncoder";

	  private static KafkaProducer instance = null;

	  private Producer producer;

	  private KafkaProducer(String brokerList) {
		System.out.println(brokerList+"!生产者数据");
	    Preconditions.checkArgument(StringUtils.isNotBlank(brokerList), "kafka brokerList is blank...");

	    // set properties
	    Properties properties = new Properties();
	    properties.put("zookeeper.connect", "ip:2181,ip:2181,ip:2181"); //声明zk
	    properties.put(METADATA_BROKER_LIST_KEY, brokerList);
	    properties.put(SERIALIZER_CLASS_KEY, SERIALIZER_CLASS_VALUE);
	    properties.put("kafka.message.CompressionCodec", "1");
	    properties.put("client.id", "streaming-kafka-output");
	    ProducerConfig producerConfig = new ProducerConfig(properties);
	    this.producer = new Producer(producerConfig);
	  }


```

### 发送数据

```Java
// 单条发送
  public void send(KeyedMessage<String, String> keyedMessage) {
    producer.send(keyedMessage);
  }

  // 批量发送
  public void send(List<KeyedMessage<String, String>> keyedMessageList) {
    producer.send(keyedMessageList);
  }

  public void shutdown() {
    producer.close();
  }

```


## 创建消费者
```Java
//		final Broadcast<String> brokerListBroadcast=SparkInitMgr.jssc.sparkContext().broadcast("192.168.20.104:9092,192.168.9.105:9092,192.168.9.106:9092,192.168.9.108:9092");
//		final Broadcast<String> topicUsDirBroadcast = SparkInitMgr.jssc.sparkContext().broadcast("usDirMap");

String[] args = { "ip:2181,ip:2181,ip:2181"
					+ "192.168.9.108:2181", "test-consumer-group", "usDirMap", "2" };
		String zooKeeper = args[0];
		String groupId = args[1];
		String topic = args[2];
		int threads = Integer.parseInt(args[3]);

		ConsumerDemo demo = new ConsumerDemo(zooKeeper, groupId, topic);
		demo.run(threads);

//	demo.shutdown();

```
