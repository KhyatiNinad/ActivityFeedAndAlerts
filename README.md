# ActivityFeedAndAlerts

**Activity Feeds and Alerts** is an Airtable Block which tracks the User Activity of all Active Users on the AirTable across all tables and provides real-time updates and alerts.

Each user can configure his own rules, where in the user can select **Multiple Tables** and/or **Views** on which he wants alerts. Any change in data, by any other user, he will get the activity feed with details on what changes are done.

Feed captures **_Adding New Records, Deleting Records as well as each and every Updates to the Records._**

Moreover, granular **Field Level Changes** are also captured, for all different kind of column types like **_Single Text, Multi-Text, Linked Records, URL, etc_** - What was the old value of the field to the new value of the field.

###Features:

* Keep a watch on **Multiple Tables** and/or **Views**
* Every user can **configure his own set of rules.** Does not depend on any Global configuration
* Get Activity Feed in **Real Time**
* **Open** up the Record directly from the Activity Feed
* Get **color-coded** information on whether record was _created_ / _updated_ / _deleted_
* Get **Field level granular information**, what was updated and when (Old Value to New Value) - supports multiple types of fields including Linked Fields
* View Details of current **Active Collaborators** to see who all are currently working on your Airtable base
* **System Alerts** using Javascript Notification API to alert user whenever a "new" record is updated. If same was updated, there will not be any alerts
* In case Notification API do not have required permission, fallback to Toast based Alerts to the users

## How to run this block

1. Copy
   [this base](https://airtable.com/shrqvXjYg9Kqqrf1O/tblTLgfrWh0ftithB/viwVTFBswwccXMqs3?blocks=hide) or any other which you like.

2. Create a new block in your new base (see
   [Create a new block](https://airtable.com/developers/blocks/guides/hello-world-tutorial#create-a-new-block)),
   entering this Git Repository as the source template.

3. From the root of your new block, run `block run`.

## See the block running