# mysql 分组查询限制条数


## 测试表

```sql
/*
SQLyog Ultimate v12.3.1 (64 bit)
MySQL - 5.7.20-log : Database - gsls
*********************************************************************
*/


/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`gsls` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_bin */;

USE `gsls`;

/*Table structure for table `province_sort` */

DROP TABLE IF EXISTS `province_sort`;

CREATE TABLE `province_sort` (
  `province_name` varchar(10) COLLATE utf8_bin DEFAULT NULL,
  `city_name` varchar(10) COLLATE utf8_bin DEFAULT NULL,
  `gdp` int(10) DEFAULT NULL,
  `rank` int(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Data for the table `province_sort` */

insert  into `province_sort`(`province_name`,`city_name`,`gdp`,`rank`) values 

('江苏','苏州',3,1),

('江苏','南京',2,2),

('江苏','无锡',1,3),

('江西','南昌',3,1),

('江西','赣州',2,2),

('江西','九江',1,3);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;


```


> 测试语句

```sql
SELECT * FROM province_sort

SELECT
  province_name,
  city_name,
  gdp,
  new_rank AS rank
FROM
  (SELECT
    province_name,
    city_name,
    gdp,
    IF(
      @tmp = province_name,
      @rank := @rank + 1,
      @rank := 1
    ) AS new_rank,
    @tmp := province_name AS tmp
  FROM
    `province_sort` a
  ORDER BY province_name,
    gdp DESC) b
WHERE new_rank <= 1;


```