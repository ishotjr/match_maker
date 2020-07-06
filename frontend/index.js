import {
	initializeBlock,
	useBase,
	useRecords,
	useGlobalConfig,
	expandRecord,
	TablePickerSynced,
	FieldPickerSynced,
	TextButton,
} from '@airtable/blocks/ui';
import React from 'react';

function MatchMaker() {
	const base = useBase();

	const globalConfig = useGlobalConfig();
	const tableId = globalConfig.get('selectedTableId');
	const descriptionFieldId = globalConfig.get('descriptionFieldId');
	const matchFieldId = globalConfig.get('matchFieldId');

	const table = base.getTableByIdIfExists(tableId);
	
	const records = useRecords(table);

	const organizations = records && descriptionFieldId && matchFieldId ? records.map(record => (
		<Organization key={record.id} record={record} descriptionFieldId={descriptionFieldId} matchFieldId={matchFieldId} />
	)) : null;

    return (
		<div>
			<TablePickerSynced globalConfigKey="selectedTableId" placeholder="Pick an Organization table" />
			<FieldPickerSynced table={table} globalConfigKey="descriptionFieldId" placeholder="Pick Description field" />
			<FieldPickerSynced table={table} globalConfigKey="matchFieldId" placeholder="Pick Matchmaking field" />
			{organizations}
		</div>
	);
}

function Organization({record, descriptionFieldId, matchFieldId}) {
	const label = record.name || 'Unnamed record';

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				fontSize: 18,
				padding: 12,
				borderBottom: '1px solid #ddd',
			}}
		>
			{record.getCellValue(matchFieldId) ? <s>{label}</s> : label}
			<div>
				<sub>{record.getCellValue(descriptionFieldId)}</sub>
			</div>
			<TextButton
				icon="expand"
				aria-label="Expand record"
				variant="dark"
				onClick={() => {
					expandRecord(record);
				}}
			/>
		</div>
	);	
}

initializeBlock(() => <MatchMaker />);
