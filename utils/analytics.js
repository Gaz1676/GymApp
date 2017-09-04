/**
 * Author: Gary Fleming
 * Student No: 20019497
 * Start Date: Aug 1st 2017
 */

'use strict';

const analytics = {

  /* This method calculates the BMI value for the member.
         The formula is BMI = kg x (height x height).
         Returns the BMI value for the member.
     The number returned is truncated to two decimal places. */

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

  /*  This method determines the BMI category that the member belongs to.
      The category is determined by the results of the members BMI according to the following:
          BMI less than    15   (exclusive)                      is 'VERY SEVERELY UNDERWEIGHT'
          BMI between      15   (inclusive) and 16   (exclusive) is 'SEVERELY UNDERWEIGHT'
          BMI between      16   (inclusive) and 18.5 (exclusive) is 'UNDERWEIGHT'
          BMI between      18.5 (inclusive) and 25   (exclusive) is 'NORMAL'
          BMI between      25   (inclusive) and 30   (exclusive) is 'OVERWEIGHT'
          BMI between      30   (inclusive) and 35   (exclusive) is 'MODERATELY OBESE'
          BMI between      35   (inclusive) and 40   (exclusive) is 'SEVERELY OBESE'
          BMI greater than 40   (inclusive)                      is 'VERY SEVERELY OBESE'
      Returns the format of a String */

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

  /* This method returns the member height converted from metres to inches.
        The number returned is truncated to 2 decimal places.
     Returns member height converted from meters to inches using the formula: metres x 39.37. */

  convertHeightMetersToInches(height) {
    let convertedHeight = (height * 39.37);
    return (convertedHeight.toFixed(2));
  },

  /* This method returns the members height converted from Kgs to pounds.
     Return member weight converted from KGs to pounds. Number returned is truncated to 2 decimal places. */

  convertWeightKGtoPounds(weight) {
    let convertedWeight = (weight * 2.2);
    return (convertedWeight.toFixed(2));
  },

  /* This method returns a boolean to indicate if the member has an ideal body weight based on the Devine formula.
     The colour of the indicator icon is based on whether a member moves further or closer to an ideal body weight.
         The Devine formula is a popular equation for estimating ideal body weight using a height measurement only.
         For Men: Kg = 50 + 2.3kg per inch over 5ft (60.0 inches).
         For Women: Kg = 45.5 + 2.3kg per inch over 5ft (60.0 inches).
     Returns the ideal body weight value that the member should be at. */

  idealBodyWeight(member) {
    const fiveFeet = 60.0;
    let idealBodyWeight = 0;
    let inches = this.convertHeightMetersToInches(member.height);
    let weight;
    const assessmentList = member.assessments;

    if (member.assessments.length >= 1) {
      weight = assessmentList[0].weight;
    } else {
      weight = member.startingWeight;
    }

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

    if ((idealBodyWeight <= (weight + 2.0)) && (idealBodyWeight >= (weight - 2.0))) {
      return 'green';
    } else if ((idealBodyWeight <= (weight + 5.0)) && (idealBodyWeight >= (weight - 5.0))) {
      return 'yellow';
    } else if ((idealBodyWeight <= (weight + 8.0)) && (idealBodyWeight >= (weight - 8.0))) {
      return 'orange';
    } else {
      return 'red';
    }
  },

  /* This method determines the colour of the trend icon based on whether a member moves further or closer to an ideal BMI.
     Return String of colour to be displayed on the members Assessment Details. */

  trend(member) {
    let trend = 'green';
    const idealBMI = 22;
    const assessmentList = member.assessments;
    if (assessmentList.length === 1) {
      const lastBMI = (member.startingWeight / (member.height * member.height));
      if (Math.abs(this.calculateBMI(member) - idealBMI) < Math.abs(lastBMI - idealBMI)) {
        trend = 'green';
      } else {
        trend = 'red';
      }
    } else if (assessmentList.length > 1) {
      const nextAssessment = assessmentList[1];
      const lastBMI = (nextAssessment.weight / (member.height * member.height));
      if (Math.abs(this.calculateBMI(member) - idealBMI) < Math.abs(lastBMI - idealBMI)) {
        trend = 'green';
      } else {
        trend = 'red';
      }
    }

    assessmentList[0].trend = trend;
  },
};

module.exports = analytics;
