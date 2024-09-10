
    const datelineSerive = {
        labels: ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.","ส."],
        datasets: [
          {
            data: [0, 10, 20, 10, 20],
            color: (opacity = 0) => `rgba(22, 49, 194, ${opacity})`, // optional
            decimalPlaces: 2,
            strokeWidth: 2 // optional
          }
        ],
        legend: ["หนึ่งสัปดาห์"] // optional
      };
    
      export  default datelineSerive


  
    