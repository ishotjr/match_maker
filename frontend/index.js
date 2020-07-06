import {
	initializeBlock,
	useBase,
	useRecords,
	useGlobalConfig,
	expandRecord,
	TablePickerSynced,
	FieldPickerSynced,
	TextButton,
	Box,
	RecordCardList,
} from '@airtable/blocks/ui';
import React from 'react';

function MatchMaker() {
	const base = useBase();

	const globalConfig = useGlobalConfig();
	const tableId = globalConfig.get('selectedTableId');
	const descriptionFieldId = globalConfig.get('descriptionFieldId');
	const matchFieldId = globalConfig.get('matchFieldId');

	const table = base.getTableByIdIfExists(tableId);

	const makeMatch = (organizationRecord, candidateRecord) => {
		table.updateRecordAsync(
			organizationRecord, {[matchFieldId]: [{id: candidateRecord.id}]}
		);
	};
	
	const records = useRecords(table);

	const candidates = base.getTableByName('Candidates');
	const candidateRecords = useRecords(candidates);

	const organizations = records && descriptionFieldId && matchFieldId ? records.map(record => (
		<Organization key={record.id} record={record} candidateRecords={candidateRecords} onMakeMatch={makeMatch} descriptionFieldId={descriptionFieldId} matchFieldId={matchFieldId} />
	)) : null;

    return (
		<div>
			<TablePickerSynced globalConfigKey="selectedTableId" placeholder="Pick an Organization table" />
			<FieldPickerSynced table={table} globalConfigKey="descriptionFieldId" placeholder="Pick Description field" />
			<FieldPickerSynced table={table} globalConfigKey="matchFieldId" placeholder="Pick Matchmaking field" />
			{organizations}

			<Box height="300px" border="thick" backgroundColor="lightGray1">
				<RecordCardList records={candidateRecords} />
			</Box>

		</div>
	);
}

function Organization({record, candidateRecords, onMakeMatch, descriptionFieldId, matchFieldId}) {
	const label = record.name || 'Unnamed record';

	const candidates = candidateRecords && descriptionFieldId && matchFieldId ? candidateRecords.map(candidateRecord => (
		<Candidate key={candidateRecord.id} record={candidateRecord} organizationRecord={record} onMakeMatch={onMakeMatch} />
	)) : null;

	return (
		<div
			style={{
				alignItems: 'center',
				justifyContent: 'space-between',
				fontSize: 18,
				padding: 12,
				borderBottom: '1px solid #ddd',
			}}
		>
			<div>
				{record.getCellValue(matchFieldId) ? <s>{label}</s> : label}
			</div>
			<div>
				<sub>{record.getCellValue(descriptionFieldId)}</sub>
			</div>
			{candidates}
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

function Candidate({record, organizationRecord, onMakeMatch}) {
	const label = record.name || 'Unnamed record';

	return (
		<TextButton
			variant="dark"
			size="xlarge"
			onClick={() => {
				onMakeMatch(organizationRecord, record);
			}}
		>
			{label}
		</TextButton>
	);	
}

initializeBlock(() => <MatchMaker />);
