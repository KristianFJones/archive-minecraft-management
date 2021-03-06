// UI/ui/Components/Admin/BackupSettingsDialog/index.tsx
import { CircularProgress } from '@rmwc/circular-progress';
import { Dialog, DialogActions, DialogButton, DialogContent, DialogTitle } from '@rmwc/dialog';
import { TextField } from '@rmwc/textfield';
import React, { ChangeEvent, Dispatch, FunctionComponent, SetStateAction, useState } from 'react';
import './BackupSettingsDialog.css';

interface BackupSettingsDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

type BackupSettingsDialogType = FunctionComponent<BackupSettingsDialogProps>;

export const BackupSettingsDialog: BackupSettingsDialogType = ({ setOpen, open }) => {
  const [defaultName, setDefaultName] = useState<string>();

  return (
    <Dialog
      open={open}
      onClose={async ({ detail }) => {
        if (detail.action === 'save') {
          console.log('Save');
        } else console.log('Canceled');
        setOpen(false);
      }}
    >
      <TextField autoFocus outlined label='HIDDEN' style={{ position: 'fixed', top: '-200vh' }} />
      <DialogTitle>Backup Settings</DialogTitle>

      <DialogContent style={{ flex: '1 1 auto', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <TextField
          style={{ marginTop: '1em', width: '100%' }}
          label='Default Backup Name'
          outlined
          value={defaultName}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) => setDefaultName(target.value)}
        />
      </DialogContent>

      <DialogActions>
        <DialogButton action='close'>Cancel</DialogButton>
        <DialogButton action='confirm' isDefaultAction icon={false && <CircularProgress />}>
          Save Settings
        </DialogButton>
      </DialogActions>
    </Dialog>
  );
};
