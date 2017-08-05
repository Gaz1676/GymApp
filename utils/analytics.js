const accounts = require('../controllers/accounts');

const analytics = {

  calculateBMI(member) {
    let memberWeight = 0;
    if (member.assessments.length > 0) {
      memberWeight = member.assessments[0].weight;
    } else {
      memberWeight = member.startingWeight;
    }

    if (member.height <= 0) {
      return 0;
    } else {
      return (memberWeight / (member.height * member.height)).toFixed(2);
    }
  },

  BMICategory(bmi) {
    if (bmi < 15) {
      return 'VERY SEVERELY UNDERWEIGHT';
    } else if ((bmi >= 15) && (bmi < 16)) {
      return 'SEVERELY UNDERWEIGHT';
    } else if ((bmi >= 16) && (bmi < 18.5)) {
      return 'UNDERWEIGHT';
    } else if ((bmi >= 18.5) && (bmi < 25)) {
      return 'NORMAL';
    } else if ((bmi >= 25) && (bmi < 30)) {
      return 'OVERWEIGHT';
    } else if ((bmi >= 30) && (bmi < 35)) {
      return 'MODERATELY OBESE';
    } else if ((bmi >= 35) && (bmi < 40)) {
      return 'SEVERELY OBESE';
    } else {
      return 'VERY SEVERELY OBESE';
    }
  },

  convertHeightMetersToInches(height) {
    let convertedHeight = (height * 39.37);
    return (convertedHeight.toFixed(2));
  },

  convertWeightKGtoPounds(weight) {
    let convertedWeight = (weight * 2.2);
    return (convertedWeight.toFixed(2));
  },

  idealBodyWeight(member) {
    const fiveFeet = 60.0;
    let idealBodyWeight = 0;
    let inches = this.convertHeightMetersToInches(member.height);
    if (inches <= fiveFeet) {
      if (member.gender === 'male') {
        idealBodyWeight = 50;
      } else {
        idealBodyWeight = 45.5;
      }
    } else {
      if (member.gender === 'male') {
        idealBodyWeight = 50 + ((inches - fiveFeet) * 2.3);
      } else {
        idealBodyWeight = 45.5 + ((inches - fiveFeet) * 2.3);
      }
    }

    if (idealBodyWeight <= member.weight + 2.0 && idealBodyWeight >= member.weight - 2.0) {
      return 'green';
    } else {
      return 'red';
    }
  },

  trend(member) {
    let trend = 'green';
    const idealBMI = 22;
    const list = member.assessments;
    if (list.length === 1) {
      const previousBMI = (member.startingWeight / (member.height * member.height));
      if (Math.abs(this.calculateBMI(member) - idealBMI) < Math.abs(previousBMI - idealBMI)) {
        trend = 'green';
      } else {
        trend = 'red';
      }
    } else if (list.length > 1) {
      const secondLatestAssessment = list[1];
      const previousBMI = (secondLatestAssessment.weight / (member.height * member.height));
      if (Math.abs(this.calculateBMI(member) - idealBMI) < Math.abs(previousBMI - idealBMI)) {
        trend = 'green';
      } else {
        trend = 'red';
      }
    } else {
      trend = 'black';
    }

    list[0].trend = trend;
  },
};

module.exports = analytics;
