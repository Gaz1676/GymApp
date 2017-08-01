'use strict';

const _ = require('lodash'); //----------------------------------------------> imports lodash (library for js)
const JsonStore = require('./json-store'); //--------------------------------> imports json-store
const analytics = require('../utils/analytics.js'); //-----------------------> imports analytics

//---> manage database of members <---//

const memberStore = {
  store: new JsonStore('./models/member-store.json', { members: [] }),
  collection: 'members',

  getAllMembers() {
    return this.store.findAll(this.collection); //---------------------------> gets all members from the store
  },

  addMember(member) {
    this.store.add(this.collection, member); //------------------------------> adds a member to the store
    this.store.save(); //----------------------------------------------------> saves new results to store
  },

  getMemberById(id) {
    return this.store.findOneBy(this.collection, { id: id }); //-------------> gets a single member by id 
  },
  
  removeMember(id) {
    const member = this.getMemberById(id); //--------------------------------> gets member by id and stores it in member
    this.store.remove(this.collection, member); //---------------------------> the member from the collection is removed from the store
    this.store.save(); //----------------------------------------------------> saves new results to store
  },

  getMemberByEmail(email) {
    return this.store.findOneBy(this.collection, { email: email }); //-------> gets a single member by email 
  },

  addAssessment(id, assessment) {
    const member = this.getMemberById(id); //--------------------------------> get member by id and store it in member
    member.assessments.unshift(assessment); //-------------------------------> loads assessment to the front of the pile
    this.store.save(); //----------------------------------------------------> saves new results to store
  },
  
  removeAssessment(id, assessmentId) { 
    const member = this.getMemberById(id); //--------------------------------> get member by id and store it in member
    _.remove(member.assessments, { assessmentId: assessmentId }); //---------> remove assessment by id from members assessments
    this.store.save(); //----------------------------------------------------> saves new results to store
  },
  
  getAssessmentById(memberId, assessmentId) {
    const member = this.getMemberById(memberId); //--------------------------> get member by id
    for (let i = 0; i < member.assessments.length; i++) { //-----------------> for 'i' is less than assessment.length in member, increment by one
      if (member.assessments[i].assessmentId === assessmentId) { //----------> if assessmentId is equal to one found then
        return member.assessments[i]; //-------------------------------------> return that assessment from the assessments in member
      }
    }
  },

};

module.exports = memberStore; //---------------------------------------------> this is the object that is then exported