import {
  Box,
  RecordCard,
  Text,
  Icon,
  Label
} from '@airtable/blocks/ui';
import React, { useState, useRef } from 'react';
import { FieldType } from '@airtable/blocks/models';
import moment from 'moment';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';

import { diffString, diff } from 'json-diff';
import ReactNotifications from 'react-browser-notifications';

import ReactDOM from 'react-dom';
import NotificationSystem from 'react-notification-system';

import { loadCSSFromURLAsync, loadCSSFromString } from '@airtable/blocks/ui';
loadCSSFromString('.vertical-timeline *{box-sizing:border-box}.vertical-timeline{width:95%;max-width:1170px;margin:0 auto;position:relative;padding:2em 0}.vertical-timeline::after{content:\'\';display:table;clear:both}.vertical-timeline::before{content:\'\';position:absolute;top:0;left:18px;height:100%;width:4px;background:#fff}@media only screen and (min-width:1170px){.vertical-timeline.vertical-timeline--two-columns{width:90%}.vertical-timeline.vertical-timeline--two-columns:before{left:50%;margin-left:-2px}}.vertical-timeline-element{position:relative;margin:2em 0}.vertical-timeline-element>div{min-height:1px}.vertical-timeline-element:after{content:"";display:table;clear:both}.vertical-timeline-element:first-child{margin-top:0}.vertical-timeline-element:last-child{margin-bottom:0}@media only screen and (min-width:1170px){.vertical-timeline-element{margin:4em 0}.vertical-timeline-element:first-child{margin-top:0}.vertical-timeline-element:last-child{margin-bottom:0}}.vertical-timeline-element-icon{position:absolute;top:0;left:0;width:40px;height:40px;border-radius:50%;box-shadow:0 0 0 4px #fff,inset 0 2px 0 rgba(0,0,0,.08),0 3px 0 4px rgba(0,0,0,.05)}.vertical-timeline-element-icon svg{display:block;width:24px;height:24px;position:relative;left:50%;top:50%;margin-left:-12px;margin-top:-12px}@media only screen and (min-width:1170px){.vertical-timeline--two-columns .vertical-timeline-element-icon{width:60px;height:60px;left:50%;margin-left:-30px}}.vertical-timeline-element-icon{-webkit-transform:translateZ(0);-webkit-backface-visibility:hidden}.vertical-timeline--animate .vertical-timeline-element-icon.is-hidden{visibility:hidden}.vertical-timeline--animate .vertical-timeline-element-icon.bounce-in{visibility:visible;-webkit-animation:cd-bounce-1 .6s;-moz-animation:cd-bounce-1 .6s;animation:cd-bounce-1 .6s}@-webkit-keyframes cd-bounce-1{0%{opacity:0;-webkit-transform:scale(.5)}60%{opacity:1;-webkit-transform:scale(1.2)}100%{-webkit-transform:scale(1)}}@-moz-keyframes cd-bounce-1{0%{opacity:0;-moz-transform:scale(.5)}60%{opacity:1;-moz-transform:scale(1.2)}100%{-moz-transform:scale(1)}}@keyframes cd-bounce-1{0%{opacity:0;-webkit-transform:scale(.5);-moz-transform:scale(.5);-ms-transform:scale(.5);-o-transform:scale(.5);transform:scale(.5)}60%{opacity:1;-webkit-transform:scale(1.2);-moz-transform:scale(1.2);-ms-transform:scale(1.2);-o-transform:scale(1.2);transform:scale(1.2)}100%{-webkit-transform:scale(1);-moz-transform:scale(1);-ms-transform:scale(1);-o-transform:scale(1);transform:scale(1)}}.vertical-timeline-element-content{position:relative;margin-left:60px;background:#fff;border-radius:.25em;padding:1em;box-shadow:0 3px 0 #ddd}.vertical-timeline-element--no-children .vertical-timeline-element-content{background:0 0;box-shadow:none}.vertical-timeline-element-content:after{content:"";display:table;clear:both}.vertical-timeline-element-content h2{color:#303e49}.vertical-timeline-element-content .vertical-timeline-element-date,.vertical-timeline-element-content p{font-size:13px;font-size:.8125rem;font-weight:500}.vertical-timeline-element-content .vertical-timeline-element-date{display:inline-block}.vertical-timeline-element-content p{margin:1em 0 0;line-height:1.6}.vertical-timeline-element-title{margin:0}.vertical-timeline-element-subtitle{margin:0}.vertical-timeline-element-content .vertical-timeline-element-date{float:left;padding:.8em 0;opacity:.7}.vertical-timeline-element-content-arrow{content:\'\';position:absolute;top:16px;right:100%;height:0;width:0;border:7px solid transparent;border-right:7px solid #fff}.vertical-timeline-element--no-children .vertical-timeline-element-content-arrow{display:none}@media only screen and (min-width:768px){.vertical-timeline-element-content h2{font-size:20px;font-size:1.25rem}.vertical-timeline-element-content p{font-size:16px;font-size:1rem}.vertical-timeline-element-content .vertical-timeline-element-date{font-size:14px;font-size:.875rem}}@media only screen and (min-width:1170px){.vertical-timeline--two-columns .vertical-timeline-element-content{margin-left:0;padding:1.5em;width:44%}.vertical-timeline--two-columns .vertical-timeline-element-content-arrow{top:24px;left:100%;transform:rotate(180deg)}.vertical-timeline--two-columns .vertical-timeline-element-content .vertical-timeline-element-date{position:absolute;width:100%;left:124%;top:6px;font-size:16px;font-size:1rem}.vertical-timeline--two-columns .vertical-timeline-element.vertical-timeline-element--right .vertical-timeline-element-content,.vertical-timeline--two-columns .vertical-timeline-element:nth-child(even):not(.vertical-timeline-element--left) .vertical-timeline-element-content{float:right}.vertical-timeline--two-columns .vertical-timeline-element.vertical-timeline-element--right .vertical-timeline-element-content-arrow,.vertical-timeline--two-columns .vertical-timeline-element:nth-child(even):not(.vertical-timeline-element--left) .vertical-timeline-element-content-arrow{top:24px;left:auto;right:100%;transform:rotate(0)}.vertical-timeline--two-columns .vertical-timeline-element.vertical-timeline-element--right .vertical-timeline-element-content .vertical-timeline-element-date,.vertical-timeline--two-columns .vertical-timeline-element:nth-child(even):not(.vertical-timeline-element--left) .vertical-timeline-element-content .vertical-timeline-element-date{left:auto;right:124%;text-align:right}}.vertical-timeline--animate .vertical-timeline-element-content.is-hidden{visibility:hidden}.vertical-timeline--animate .vertical-timeline-element-content.bounce-in{visibility:visible;-webkit-animation:cd-bounce-2 .6s;-moz-animation:cd-bounce-2 .6s;animation:cd-bounce-2 .6s}@media only screen and (min-width:1170px){.vertical-timeline--two-columns.vertical-timeline--animate .vertical-timeline-element.vertical-timeline-element--right .vertical-timeline-element-content.bounce-in,.vertical-timeline--two-columns.vertical-timeline--animate .vertical-timeline-element:nth-child(even):not(.vertical-timeline-element--left) .vertical-timeline-element-content.bounce-in{-webkit-animation:cd-bounce-2-inverse .6s;-moz-animation:cd-bounce-2-inverse .6s;animation:cd-bounce-2-inverse .6s}}@media only screen and (max-width:1169px){.vertical-timeline--animate .vertical-timeline-element-content.bounce-in{visibility:visible;-webkit-animation:cd-bounce-2-inverse .6s;-moz-animation:cd-bounce-2-inverse .6s;animation:cd-bounce-2-inverse .6s}}@-webkit-keyframes cd-bounce-2{0%{opacity:0;-webkit-transform:translateX(-100px)}60%{opacity:1;-webkit-transform:translateX(20px)}100%{-webkit-transform:translateX(0)}}@-moz-keyframes cd-bounce-2{0%{opacity:0;-moz-transform:translateX(-100px)}60%{opacity:1;-moz-transform:translateX(20px)}100%{-moz-transform:translateX(0)}}@keyframes cd-bounce-2{0%{opacity:0;-webkit-transform:translateX(-100px);-moz-transform:translateX(-100px);-ms-transform:translateX(-100px);-o-transform:translateX(-100px);transform:translateX(-100px)}60%{opacity:1;-webkit-transform:translateX(20px);-moz-transform:translateX(20px);-ms-transform:translateX(20px);-o-transform:translateX(20px);transform:translateX(20px)}100%{-webkit-transform:translateX(0);-moz-transform:translateX(0);-ms-transform:translateX(0);-o-transform:translateX(0);transform:translateX(0)}}@-webkit-keyframes cd-bounce-2-inverse{0%{opacity:0;-webkit-transform:translateX(100px)}60%{opacity:1;-webkit-transform:translateX(-20px)}100%{-webkit-transform:translateX(0)}}@-moz-keyframes cd-bounce-2-inverse{0%{opacity:0;-moz-transform:translateX(100px)}60%{opacity:1;-moz-transform:translateX(-20px)}100%{-moz-transform:translateX(0)}}@keyframes cd-bounce-2-inverse{0%{opacity:0;-webkit-transform:translateX(100px);-moz-transform:translateX(100px);-ms-transform:translateX(100px);-o-transform:translateX(100px);transform:translateX(100px)}60%{opacity:1;-webkit-transform:translateX(-20px);-moz-transform:translateX(-20px);-ms-transform:translateX(-20px);-o-transform:translateX(-20px);transform:translateX(-20px)}100%{-webkit-transform:translateX(0);-moz-transform:translateX(0);-ms-transform:translateX(0);-o-transform:translateX(0);transform:translateX(0)}}');
loadCSSFromString('.hidden{display:none} .activity-block{max-height:200px; overflow-y:auto;} h3{padding:6px} .slide > div > a {width:100% !important; min-height: 140px !important; overflow-y:auto !important;}.slide > div > a > div > div{display:block !important;}');

export class ActivityFeed extends React.Component {

  constructor(props) {
    super(props);

    this.globalConfig = this.props.globalConfig;

    this.GlobalConfigKeys = this.props.GlobalConfigKeys;

    this.currentUser = this.props.currentUser;
    this.allowNotification = this.props.allowNotification;

    this.records = this.props.records.data.map(record => {
      var innerData = record.records.map(e => {
        return { id: e.id, records: e._data.cellValuesByFieldId };
      });
      return { id: record.id, records: innerData };
    });
    var records = this.props.records.data.map(function (e) { return e.records; })
    this.allRecords = [];
    records.forEach((r) => { r.forEach((x) => { this.allRecords.push({ id: x._id, name: x.name }); }) });


    this.previousRecords = (JSON.stringify(this.records));


    this.feed = [];
    this.state = { time: new Date(), timeStamp: this.props.timeStamp, records: this.props.records.data };

    this.lastNotification = "-1";

    this.showNotifications = this.showNotifications.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.inputElement = React.createRef();
    this.buttonClick = this.buttonClick.bind(this);
    this.notificationSystem = React.createRef();
  }

  componentDidUpdate(prevProps) {
    
    this.allowNotification = this.props.allowNotification;

    if ((prevProps.timeStamp) !== (this.props.timeStamp)) {

      var pvRecords = JSON.parse(this.previousRecords);

      var curRecords = this.props.records.data.map(record => {
        var innerData = record.records.map(e => {
          return { id: e.id, records: e._data.cellValuesByFieldId };
        });
        return { id: record.id, records: innerData };

      });

      // Get All Differences
      const currentConfig = this.globalConfig.get(this.currentUser + "_" + this.GlobalConfigKeys.ALERT_CONFIG);
      for (var j = 0; j < currentConfig.length; j++) {
        var tabId = currentConfig[j].tableId;

        var lastData = pvRecords.filter((e) => { return e.id == tabId; });
        var currentData = curRecords.filter((e) => { return e.id == tabId; });


        if (lastData.length > 0 && currentData.length > 0) {
          console.log("Writing Diff:");
          console.log(lastData);
          console.log(currentData);

          if (typeof lastData[0].records !== 'undefined' && typeof currentData[0].records !== 'undefined') {
            var difference = diff(lastData[0].records, currentData[0].records);
            console.log(difference);
            if (typeof difference !== 'undefined') {
              var allRecords = this.props.records.data.filter((e) => { return e.id == tabId });
              var rec = [];
              if (allRecords.length > 0)
                rec = allRecords[0].records;

              for (var i = 0; i < difference.length; i++) {
                console.log(difference[i][0]);
                if (difference[i][0] !== ' ') {

                  var recId = '';
                  if (difference[i][0] === "-") {
                    recId = lastData[0].records[i].id;
                  }
                  else {
                    recId = currentData[0].records[i].id;
                  }


                  var thisRecord = rec.filter((e) => { return e._id == recId });

                  console.log("..." + difference[i][0] + " : " + i + " : " + (difference[i][1]) + recId);

                  var feedExist = this.feed.filter((e) => { return e.recordId === recId });

                  // console.log((appointments[i]));
                  if (difference[i][0] !== "-") {
                    var recordName = "";
                    var updatedRecord = this.allRecords.filter((r) => { return r.id === recId });

                    if (updatedRecord.length > 0)
                      recordName = updatedRecord[0].name;



                    var item = { updates: [] };
                    if (feedExist.length > 0)
                      item = feedExist[0];

                    if (thisRecord.length > 0) {
                      item.tableId = tabId;
                      if (item.activity !== "+")
                        item.activity = difference[i][0];
                      item.recordId = recId;
                      item.record = thisRecord[0];
                      item.timeStamp = moment().utc().unix();
                      item.recordName = recordName;


                      if (difference[i][0] !== "+") {

                        var upd = difference[i][1].records;

                        if (typeof item.updates == 'undefined')
                          item.updates = [];
                        if (typeof upd !== 'undefined') {
                          if (upd != null) {
                            for (const [key, value] of Object.entries(upd)) {

                              item.updates.push({
                                field: key,
                                value: value,
                                timeStamp: item.timeStamp
                              });
                            }
                          }
                        }
                      }

                      if (feedExist.length == 0)
                        this.feed.push(item);
                    }
                  }
                  else {

                    var recordName = "N/A";
                    var deletedRecord = this.allRecords.filter((r) => { return r.id === recId });

                    if (deletedRecord.length > 0)
                      recordName = deletedRecord[0].name;


                    var item = {};
                    if (feedExist.length > 0)
                      item = feedExist[0];

                    item.tableId = tabId;
                    item.activity = difference[i][0];
                    item.recordId = recId;
                    item.record = null;
                    item.timeStamp = moment().utc().unix();
                    item.deletedData = recordName;
                    item.recordName = recordName;
                    if (feedExist.length == 0)
                      this.feed.push(item);

                  }
                }
              }
            }
          }
        }
      }



      // TO DO
      this.records = this.props.records.data.map(record => {
        var innerData = record.records.map(e => {
          return { id: e.id, records: e._data.cellValuesByFieldId };
        });
        return { id: record.id, records: innerData };

      });
      this.previousRecords = (JSON.stringify(this.records));

      var records = this.props.records.data.map(function (e) { return e.records; })
      this.allRecords = [];
      records.forEach((r) => { r.forEach((x) => { this.allRecords.push({ id: x._id, name: x.name }); }) });


      // console.log(this.previousRecords.length + " " + this.records.length);

      this.setState({
        time: new Date(),
        timeStamp: this.props.timeStamp,
        records: this.props.records.data

      });
    }
  }
  componentDidMount() {
  }

  componentWillUnmount() {
  }


  showNotifications() {
    if (this.n.supported() && this.allowNotification) {
      var prm = Notification.permission;
      if (prm == 'default' || prm == 'denied') {
        console.log("permission denied or default");

        const notification = this.notificationSystem.current;
        notification.addNotification({
          message: this.notifBody,
          title: this.notifTitle,
          autoDismiss: 10,
          level: this.notifLevel
        });
      } else {
        this.n.show();
      }
    }
  }

  handleClick(event) {
    if (this.n.supported()) {
      var prm = Notification.permission;
      if (prm == 'default' || prm == 'denied') {
        console.log("permission denied or default");
      } else {
        window.focus()
        this.n.close(event.target.tag);
      }
    }
  }

  buttonClick(event) {
    this.inputElement.click();
  }

  getVal = (val) => {
    if (typeof val === 'object') {
      if (typeof val.name !== 'undefined')
        val = val.name;

      if (typeof val.length !== 'undefined') {
        if (val.length > 0) {
          if (typeof val[0].name !== 'undefined')
            val = val[0].name;

        }
      }
    }
    else if (typeof val === 'string') {

    }
    else {
      val = 'N/A';
    }
    return val;
  }
  render() {

    var box = (
      <Box padding={4}>
        <Text size="large" fontWeight={200} fontStyle="italic">
          Awaiting Activity Feed...
      </Text>
      </Box>
    );


    this.notifTitle = '';
    this.notifBody = '';
    this.notifLevel = "success";

    var showNotif = false;

    if (this.feed.length > 0) {

      this.feed = this.feed.sort(function (a, b) {
        try {

          return (a.timeStamp < b.timeStamp) ? 1 : ((a.timeStamp > b.timeStamp) ? -1 : 0);

        }
        catch (e) { }
      });


      var thisRecord = this.feed[0];
      if (thisRecord.recordId !== this.lastNotification) {
        showNotif = true;
        this.notifTitle = "Record Updated";
        this.notifBody = thisRecord.recordName;
        this.lastNotification = thisRecord.recordId;
        if (thisRecord.activity === '+') {
          this.notifLevel = "success";
          this.notifTitle = "Record Added";
        }
        else if (thisRecord.activity === '-') {
          this.notifLevel = "error";
          this.notifTitle = "Record Deleted";
        }
        else {
          this.notifLevel = "info";
        }

      }

      // check if all records available
      var records = this.props.records.data.map(function (e) { return e.records; })
      var allRec = [];
      records.forEach((r) => { r.forEach((x) => { allRec.push(x._id) }) });

      box = this.feed.map(e => {
        // console.log(e);
        var isRecExist = false;

        var updates = '';//JSON.stringify(e.updates);
        var dt = moment.unix(e.timeStamp).fromNow();
        var col = 'rgb(33, 150, 243)';
        var icon = <Icon name="calendar" size={20} />;
        if (e.activity == "+") {
          col = "rgb(0, 200,0)";
          icon = <Icon name="plus" size={20} />;
        }
        else if (e.activity == "-") {
          col = "rgb(200, 0, 0)";
          icon = <Icon name="minus" size={20} />;
        }


        var tableName = 'Table';
        try {
          var tx = this.props.base.getTableByIdIfExists(e.tableId);
          if (tx != null) {
            tableName += ": " + tx.name;

            var updx = e.updates.map((r) => {

              var dx = moment.unix(r.timeStamp).format('DD-MMM-YYYY hh:mm A');
              var fx = tx.getFieldByIdIfExists(r.field.replace('__added', '').replace('__deleted', ''));
              var fieldName = r.field;
              if (fx != null)
                fieldName = fx.name;

              var val = r.value;

              var oldVal = '';
              var newVal = '';
              if (r.field.indexOf('__added') >= 0) {
                try {
                  oldVal = '';
                  newVal = this.getVal(val);

                }
                catch (e) { }


                if (newVal === 'N/A') {
                  try {
                    newVal = this.getVal(val.name.__new);
                  }
                  catch (e) { }
                }
                if (newVal !== 'N/A')
                  newVal += " added";
              }
              else if (r.field.indexOf('__deleted') >= 0) {
                try {
                  oldVal = this.getVal(val);
                  newVal = '';//this.getVal(val);

                }
                catch (e) { }


                if (oldVal === 'N/A') {
                  try {
                    oldVal = this.getVal(val.name.__old);
                  }
                  catch (e) { }
                }
                if (oldVal !== 'N/A')
                  oldVal += " removed";
              }
              else {
                try {
                  oldVal = this.getVal(val.__old);
                  newVal = this.getVal(val.__new);

                }
                catch (e) { }

                if (oldVal === 'N/A') {
                  try {
                    oldVal = this.getVal(val.name.__old);
                  }
                  catch (e) { }
                }
                if (newVal === 'N/A') {
                  try {
                    newVal = this.getVal(val.name.__new);
                  }
                  catch (e) { }
                }
                newVal = " → " + newVal;
              }
              return (
                <Box
                  backgroundColor="white"
                  padding={1}
                  style={{ display: 'flex', width: '100%', marginTop: '1px', borderBottom: '1px solid #999' }}
                >

                  <div style={{ display: 'flex', width: '100%' }}>
                    <Label style={{ display: 'flex', flexGrow: 1, flexWrap: 'wrap', width: '33%' }}>Field: {fieldName} </Label>
                    <Label style={{ display: 'flex', flexGrow: 1, flexWrap: 'wrap', width: '33%' }}>{oldVal}{newVal}</Label>
                    <Label style={{ display: 'flex', flexGrow: 1, flexWrap: 'wrap', width: '33%' }}>{dx}</Label>
                  </div>
                </Box>
              );

            });
            if (e.activity === '+' && e.updates.length == 0) {
              updates = (
                <Box
                  border="default"
                  backgroundColor="white"
                  borderRadius="large"
                  className="activity-block"
                  padding={2}
                  style={{ width: '100%', marginTop: '10px' }}
                >
                  <h3 style={{ color: "#000", padding: '2px', margin: '0px' }}>New Record Added</h3>

                </Box>);
            }
            else {
              updates = (

                <Box
                  border="default"
                  backgroundColor="white"
                  borderRadius="large"
                  className="activity-block"
                  padding={2}
                  style={{ width: '100%', marginTop: '10px' }}
                >
                  <h3 style={{ color: "#000", padding: '2px', margin: '0px', borderBottom: '1px solid #999' }}>Field Updates:</h3>

                  {updx}
                </Box>);
            }

          }

        }
        catch (e) { }

        if (e.record != null) {
          var thisRec = allRec.filter((r) => { return r === e.record._id; });
          if (thisRec.length > 0) {


            return (
              <VerticalTimelineElement key={e.recordId}
                className="vertical-timeline-element--work slide"
                contentStyle={{ background: col, color: '#fff' }}
                contentArrowStyle={{ borderRight: '7px solid  ' + col }}
                date={dt}
                iconStyle={{ background: col, color: '#fff' }}
                icon={icon}
              >
                <h3 className="vertical-timeline-element-title">{tableName}</h3>

                <RecordCard record={e.record} key={e.recordId} />
                {updates}
              </VerticalTimelineElement>
            );
          }
          else {
            <VerticalTimelineElement key={e.recordId}
              className="vertical-timeline-element--work slide"
              contentStyle={{ background: col, color: '#fff' }}
              contentArrowStyle={{ borderRight: '7px solid  ' + col }}
              date={dt}
              iconStyle={{ background: col, color: '#fff' }}
              icon={icon}
            >
              <h3 className="vertical-timeline-element-title">{tableName}</h3>
   Record Deleted
                        </VerticalTimelineElement>
          }
        }
        else {

          return (<VerticalTimelineElement key={e.recordId}
            className="vertical-timeline-element--work slide"
            contentStyle={{ background: col, color: '#fff' }}
            contentArrowStyle={{ borderRight: '7px solid  ' + col }}
            date={dt}
            iconStyle={{ background: col, color: '#fff' }}
            icon={icon}

          >
            <h3 className="vertical-timeline-element-title">{tableName}</h3>
            <p>
              Record Deleted: {e.deletedData}
            </p>
          </VerticalTimelineElement>)
        }
      });

    }

    if (showNotif) {
      var that = this;
      setTimeout(function (e) {
        that.inputElement.current.click()

      }, 100);
    }
    return (
      <Box
        border="thick"
        backgroundColor="lightGray3"
        borderRadius="large"
        padding={2}
        width={'100%'}
        overflow="auto"
      >
        <VerticalTimeline layout='2-columns'>
          {box}
        </VerticalTimeline>
        <ReactNotifications
          onRef={ref => (this.n = ref)} // Required
          title={this.notifTitle} // Required
          body={this.notifBody}
          tag="Activity Alert"
          onClick={event => this.handleClick(event)}
        />
        <button className="hidden" ref={this.inputElement} onClick={this.showNotifications}>
        </button>
        <NotificationSystem ref={this.notificationSystem} />
      </Box>
    );
  }
}