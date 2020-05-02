# idea 打jar包一直有问题，今天好好解决

java -jar D:\MyGitClone-Res\git-liu-55-2\liu39236255.github.io\AllProject\Spark_Study\out\artifacts\Spark_Study_jar\Spark_Study.jar


java -jar D:\MyGitClone-Res\git-liu-55-2\liu39236255.github.io\AllProject\Spark_Study\target\Wiki-Spark-Study-1.0-SNAPSHOT.jar

java 　－classpath　D:\MyGitClone-Res\git-liu-55-2\liu39236255.github.io\AllProject\Spark_Study\target\lib　-jar F:\G盘\jarTest\Wiki-Spark-Study-1.0-SNAPSHOT.jar

## jar包提取

###　idea 自定义的方式

###  maven插件

```xml
<!--依赖JAR提取插件-->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-dependency-plugin</artifactId>
                <version>3.0.2</version>
                <configuration>
                    <outputDirectory>${project.build.directory}/lib</outputDirectory>
                </configuration>
                <executions>
                    <execution>
                        <phase>package</phase>
                        <goals>
                            <goal>copy-dependencies</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>

            <!--生成主清单属性-->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-jar-plugin</artifactId>
                <version>3.0.2</version>
                <configuration>
                    <archive>
                        <manifest>
                            <addClasspath>true</addClasspath>
                            <classpathPrefix>lib/</classpathPrefix>
                            <mainClass>lzkj.Spark_Study.Common_Remember.simplecore_test.ConfigurationTest</mainClass>
                        </manifest>
                    </archive>
                </configuration>
            </plugin>
        </plugins>
    </build>
```
