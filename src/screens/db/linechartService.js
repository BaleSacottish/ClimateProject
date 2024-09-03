
    const datelineSerive = {
        labels: ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.","ส."],
        datasets: [
          {
            data: [0, 10, 20, 10, 20, 5],
            color: (opacity = 0) => `rgba(22, 49, 194, ${opacity})`, // optional
            strokeWidth: 2 // optional
          }
        ],
        legend: ["หนึ่งสัปดาห์"] // optional
      };
    
      export  default datelineSerive


  
    