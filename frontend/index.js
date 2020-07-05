import {
    initializeBlock,
    useBase,
    useRecords,
    useGlobalConfig,
    useSettingsButton,
    Box,
    Heading,
    ViewPickerSynced,
    RecordCard,
    TablePickerSynced,
    FormField,
    FieldPickerSynced,
    Button,
    Text, Icon,
    ViewportConstraint,
    colors,
    colorUtils,
    useSession,
    Dialog,
    SelectButtons,
    useViewport,
    Label,
     CollaboratorToken, Tooltip 
} from '@airtable/blocks/ui';
import React, { useState } from 'react';
import { FieldType } from '@airtable/blocks/models';
import moment from 'moment';

import { diffString, diff } from 'json-diff';
import {ActivityFeed} from './activityFeed';
import CollabInfo from './collabInfo';

const GlobalConfigKeys = {
    SELECTED_TABLE_ID: 'selectedTableId',
    SELECTED_VIEW_ID: 'selectedViewId',
    NOTIFICATION_ID: 'notificationId',
    ALERT_CONFIG: 'alertConfig'
};


function ActivityFeedAndAlertsBlock() {
    const VIEWPORT_MIN_WIDTH = 345;
    const VIEWPORT_MIN_HEIGHT = 200;
    const base = useBase();
    const globalConfig = useGlobalConfig();


    const currentUserSession = useSession();

    const currentUser = currentUserSession.currentUser.id;
    const currentUserName = currentUserSession.currentUser.name;
    const currentUserAvatar = currentUserSession.currentUser.profilePicUrl;

    const currentConfig = globalConfig.get(currentUser + "_" + GlobalConfigKeys.ALERT_CONFIG);

    const allowNotification = globalConfig.get(currentUser + "_" + GlobalConfigKeys.NOTIFICATION_ID) === "Yes" ? true : false;

    const initialSetupDone = currentConfig ? (currentConfig.length > 0 ? true : false) : false;

    // Use settings menu to hide away table pickers
    const [isShowingSettings, setIsShowingSettings] = useState(!initialSetupDone);
    useSettingsButton(function () {
        initialSetupDone && setIsShowingSettings(!isShowingSettings);
    });

    var handleAddNewRule = () => {

        var records = globalConfig.get(currentUser + "_" + GlobalConfigKeys.ALERT_CONFIG);
        var currentConfig = records ? records : [];

        var tId = globalConfig.get(currentUser + "_" + GlobalConfigKeys.SELECTED_TABLE_ID);
        var vId = globalConfig.get(currentUser + "_" + GlobalConfigKeys.SELECTED_VIEW_ID);
        var table = base.getTableByIdIfExists(tId);
        var tName = table ? table.name : '';

        var exists = currentConfig.filter(r => { return r.tableId == tId; });
        if (exists.length > 0) {
            alert('Configuration for this table already exists. Please delete and re-add');
            return;
        }
        var view = table ? table.getViewByIdIfExists(vId) : null;
        var vName = view ? view.name : '';
        var newRecord = {
            id: moment().utc().unix(), tableId: tId,
            viewId: vId, table: tName, view: vName
        };
        currentConfig.push(newRecord);
        globalConfig.setAsync(currentUser + "_" + GlobalConfigKeys.ALERT_CONFIG, currentConfig);

        globalConfig.setAsync(currentUser + "_" + GlobalConfigKeys.SELECTED_VIEW_ID, '');
        globalConfig.setAsync(currentUser + "_" + GlobalConfigKeys.SELECTED_TABLE_ID, '');

    }

    var watches = {
        timeStamp : moment().utc().unix(),
        data: []};

    base.tables.forEach(e => {



        var tId = e.id;
        var vId = null;

        var config = currentConfig.filter(e => { return e.tableId == tId; });
        var table = null;
        var view = null;
        table = base.getTableByIdIfExists(tId);

        if (config.length > 0) {
            vId = config[0].viewId;
            var view = table ? table.getViewByIdIfExists(vId) : null;

        }

        var rec = useRecords(view ? view.selectRecords() :
            (table ? table.selectRecords() : null));

        watches.data.push({ id: tId, records: rec });
    });

   // console.log(watches);

    if (isShowingSettings) {
        return (
            <ViewportConstraint minSize={{ width: VIEWPORT_MIN_WIDTH, height: VIEWPORT_MIN_HEIGHT }}>
                <SettingsMenu
                    globalConfig={globalConfig}
                    base={base}
                    initialSetupDone={initialSetupDone}
                    currentUser={currentUser}
                    onDoneClick={() => setIsShowingSettings(false)}
                    handleAddNewRule={handleAddNewRule}
                />
            </ViewportConstraint>
        )
    } else {

        var records = [];
        return (
            <ViewportConstraint minSize={{ width: VIEWPORT_MIN_WIDTH, height: VIEWPORT_MIN_HEIGHT }}>
                <CollabInfo ></CollabInfo>
                <Box paddingX={2} marginX={1}>
                <Heading size="default">Activity Feed</Heading>
                    <ActivityFeedBox records={watches} globalConfig={globalConfig} 
                    currentUser={currentUser} base={base} allowNotification={allowNotification}/>
                </Box>
            </ViewportConstraint>
        );
    }
}

function ActivityFeedBox(props) {

    if (props.records.length == 0) {
        return (
            <Box padding={1} key="activityBox">
                <Text size="large" fontWeight={200} fontStyle="italic">
                    Awaiting Activity Feed...
            </Text>
            </Box>
        )
    }
    else {
        return (
            <Box padding={1}  key="activityBoxData">
                <ActivityFeed records={props.records} timeStamp={props.records.timeStamp}  
                globalConfig={props.globalConfig} currentUser={props.currentUser} GlobalConfigKeys={GlobalConfigKeys}
                base={props.base} allowNotification={props.allowNotification} />
            </Box>
        );
    }
};




function SettingsMenu(props) {

    const resetTableConfigFieldKeys = () => {
        props.globalConfig.setAsync(GlobalConfigKeys.SELECTED_TABLE_ID, '');
        props.globalConfig.setAsync(GlobalConfigKeys.SELECTED_VIEW_ID, '');
    }

    const options = [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" }
    ];

    var records = props.globalConfig.get(props.currentUser + "_" + GlobalConfigKeys.ALERT_CONFIG);
    var currentConfig = records ? records : [];
    var tasks = records
        ? records.map(record => {
            return <Config recId={record.id} view={record.view} table={record.table} currentUser={props.currentUser} globalConfig={props.globalConfig} />;
        })
        : null;

    if (currentConfig.length == 0) {
        tasks = (<Label>Please configure Tasks below:</Label>)
    }
    return (
        <div>
            <Heading margin={2}>
                Activity Feed Configuration
            </Heading>
            <div>
                <Box padding={3} borderBottom="thick">
                    {tasks}
                </Box>

                <Heading padding={3} size="small">Add New Rule</Heading>
               
                <AddConfigForm base={props.base} currentUser={props.currentUser} globalConfig={props.globalConfig} onClick={props.handleAddNewRule} />
            </div>
            <div>
            <Box padding={3} borderTop="thick" borderBottom="thick">
            <FormField label="Enable Notifications">
                                        <SelectButtons
                                            value={props.globalConfig.get(props.currentUser + "_" + GlobalConfigKeys.NOTIFICATION_ID)}
                                            onChange={newValue => {
                                                props.globalConfig.setAsync(props.currentUser + "_" + GlobalConfigKeys.NOTIFICATION_ID, newValue);
                                            }}
                                            options={options}
                                            width="320px"
                                        />
                                        </FormField>
                                        </Box>
            </div>
            <Box display="flex" marginBottom={2}>
                <Button
                    variant="primary"
                    icon="check"
                    marginLeft={2}
                    disabled={!props.initialSetupDone}
                    onClick={props.onDoneClick}
                    alignSelf="right"
                >
                    Done
                </Button>
            </Box>
        </div>
    );
}


function Config({ recId, table, view, currentUser, globalConfig }) {
    var thisView = '';
    if (view)
        if (view !== '')
            thisView = 'View: ' + view;
    return (
        <Box
            fontSize={4}
            paddingX={3}
            paddingY={2}
            marginRight={-2}
            borderBottom="default"
            display="flex"
            alignItems="center"
        >
            <Label style={{ display: 'flex', flexGrow: 1, flexWrap: 'wrap' }}> Table: {table}<br />
                {thisView}   </Label>
            <ConfigDeleteButton currentUser={currentUser} recId={recId} globalConfig={globalConfig} />
        </Box>
    );
}

function ConfigDeleteButton(props) {
    function onClick() {
        var records = props.globalConfig.get(props.currentUser + "_" + GlobalConfigKeys.ALERT_CONFIG);
        var currentConfig = records ? records : [];

        var rec = currentConfig.filter(r => { return r.id !== props.recId; });
        props.globalConfig.setAsync(props.currentUser + "_" + GlobalConfigKeys.ALERT_CONFIG, rec);
    }

    return (
        <Button
            variant="secondary"
            marginLeft={1}
            onClick={onClick}
        >
            <Icon name="x" style={{ display: 'flex', flexGrow: 1 }} />
        </Button>
    );
}

function AddConfigForm(props) {


    const isFormEnabled = props.globalConfig.get(props.currentUser + "_" + GlobalConfigKeys.SELECTED_TABLE_ID) &&
        props.globalConfig.get(props.currentUser + "_" + GlobalConfigKeys.SELECTED_TABLE_ID) ?
        (props.globalConfig.get(props.currentUser + "_" + GlobalConfigKeys.SELECTED_TABLE_ID) !== '' &&
            props.globalConfig.get(props.currentUser + "_" + GlobalConfigKeys.SELECTED_TABLE_ID) !== '' ? true : false)
        : false;
    return (
        <Box display="flex" padding={3}>
            <FormField label="Table">
                <TablePickerSynced
                    size="large"
                    maxWidth="350px"
                    globalConfigKey={props.currentUser + "_" + GlobalConfigKeys.SELECTED_TABLE_ID} />
            </FormField>
            <FormField label="View">
                <ViewPickerSynced
                    shouldAllowPickingNone={true}
                    size="large"
                    maxWidth="350px"
                    table={props.base.getTableByIdIfExists(props.globalConfig.get(props.currentUser + "_" + GlobalConfigKeys.SELECTED_TABLE_ID))}
                    globalConfigKey={props.currentUser + "_" + GlobalConfigKeys.SELECTED_VIEW_ID}
                ></ViewPickerSynced>
            </FormField>
            <Button variant="primary" marginLeft={2} marginTop={'24px'} onClick={props.onClick} disabled={!isFormEnabled}>
                Add Rule
                </Button>
        </Box>
    );
}

initializeBlock(() => <ActivityFeedAndAlertsBlock />);