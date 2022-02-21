# Echarts

## 浏览器画图方式

- canvas：点矩阵，缩放失真，适合图形数量非常大的图表
- svg：矢量图，缩放不失真，适合图像数量较少的图表

## 起步

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <style>
    #main {
      width: 700px;
      height: 500px;
    }
  </style>
</head>

<body>
  <!-- 建立带有宽高dom容器 -->
  <div id="main"></div>

  <!-- 引入echarts -->
  <script src="https://lib.baomitu.com/echarts/5.2.0/echarts.min.js"></script>

  <script>
    //初始化echarts实例
    const main = document.getElementById('main');
    const chart = echarts.init(main)

    //设置配置项
    const option = {
      xAxis: {
        data: ['html', 'css', 'js']
      },
      yAxis: {},
      series: {
        type: 'bar', //记得指定图表类型
        data: [30, 20, 10]
      }
    }

    chart.setOption(option)
  </script>

</body>

</html>
```

