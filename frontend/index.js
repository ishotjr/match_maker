import {
	initializeBlock,
	useBase,
	useRecords,
	useGlobalConfig,
	expandRecord,
	TablePickerSynced,
	TextButton,
} from '@airtable/blocks/ui';
import React from 'react';

function MatchMaker() {
	const base = useBase();

	const globalConfig = useGlobalConfig();
	const tableId = globalConfig.get('selectedTableId');

	const table = base.getTableByIdIfExists(tableId);
	const records = useRecords(table);

	const organizations = records ? records.map(record => (
		<Organization key={record.id} record={record} />
	)) : null;

    return (
		<div>
			<TablePickerSynced globalConfigKey="selectedTableId" placeholder="Pick an Organization table" />
			{organizations}
		</div>
	);
}

//function Organization({record, completedFieldId, onToggle}) {
function Organization({record}) {
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
			{label}
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
