

const monthlineSerive = {
    labels: ["มค.", "กพ.", "มีค.", "เม.ย.",],
    datasets: [
      {
        data: [0, 10, 20, 10, 20, 5],
        color: (opacity = 0) => `rgba(22, 49, 194, ${opacity})`, // optional
        strokeWidth: 2 // optional
      }
    ],
    legend: ["สี่เดือน"] // optional
  };

  export  default monthlineSerive
