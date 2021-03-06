// UI/ui/Components/Admin/Mods/index.tsx
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Dialog, DialogActions, DialogButton, DialogContent, DialogTitle } from '@rmwc/dialog';
import { IconButton } from '@rmwc/icon-button';
import { List, ListItem, ListItemMeta } from '@rmwc/list';
import { Menu, MenuItem, MenuSurfaceAnchor } from '@rmwc/menu';
import { Typography } from '@rmwc/typography';
import React, { ChangeEvent, FunctionComponent, useState } from 'react';
import { FormStyle } from 'ui/lib/styles';
import DELETEMODGQL from './deleteMod.graphql';
import MODSGQL from './Mods.graphql';
import './style.css';
import TOGGLEMODGQL from './toggleMod.graphql';
import UPLOADMODGQL from './UploadMod.graphql';

interface ModItemProps {
  name: string;
  disabled: boolean;
  fileName: string;
  toggleModFN: (modName: string) => Promise<any>;
}

type ModItemType = FunctionComponent<ModItemProps>;

const ModItem: ModItemType = ({ name, disabled, fileName, toggleModFN }) => {
  const [open, setOpen] = useState(false);
  const [dialog, setDialog] = useState<boolean>(false);
  const [action, setAction] = useState<'Delete' | 'Toggle'>();
  const [deleteModFN] = useMutation<{ deleteMod: boolean }, { modName: string }>(DELETEMODGQL);

  const deleteMod = () => {
    setAction('Delete');
    setDialog(true);
  };

  const toggleMod = () => {
    setAction('Toggle');
    setDialog(true);
  };

  return (
    <>
      <MenuSurfaceAnchor style={{ width: '100%' }}>
        <ListItem disabled={disabled} style={{ width: '92%' }}>
          {name}
          <ListItemMeta icon='menu' onClick={() => setOpen(!open)} />
        </ListItem>

        <Menu open={open} onClose={evt => setOpen(false)} style={{ right: 0, left: 'unset' }}>
          <MenuItem onClick={deleteMod}>Delete</MenuItem>
          <MenuItem onClick={toggleMod}>{disabled ? 'Enable' : 'Disable'}</MenuItem>
        </Menu>
        {/** The handle can be any component you want */}
      </MenuSurfaceAnchor>
      <Dialog
        open={dialog}
        onClose={evt => {
          if (action === 'Delete' && evt.detail.action === 'confirm')
            deleteModFN({
              variables: {
                modName: fileName,
              },
            });
          else if (action === 'Toggle' && evt.detail.action === 'confirm') toggleModFN(name);
          setDialog(false);
        }}
      >
        <DialogTitle>{`${action} ${name}`}</DialogTitle>
        <DialogContent>
          Are you sure you want to {action} {name}?
        </DialogContent>
        <DialogActions>
          <DialogButton action='close'>Cancel</DialogButton>
          <DialogButton action='confirm' isDefaultAction>
            {action}
          </DialogButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

interface ModType extends ModItemProps {
  disabled: boolean;
}

export const AdminModManagement = () => {
  const { data, loading, refetch } = useQuery<{ listMods: ModType[] }>(MODSGQL);
  const [uploadMod] = useMutation<{}, { file: any }>(UPLOADMODGQL);
  const [toggleModFN] = useMutation<{}, { modName: string }>(TOGGLEMODGQL);

  const toggleMod = async (modName: string) => {
    await toggleModFN({
      variables: {
        modName,
      },
    });

    await refetch();
  };

  return (
    <div style={FormStyle}>
      <div style={{ display: 'flex', width: '100%' }}>
        <Typography
          style={{ alignSelf: 'center', position: 'absolute', left: '49%', transform: 'translateX(-50%)' }}
          use='headline4'
        >
          Mods
        </Typography>
        <IconButton style={{ alignSelf: 'flex-end', marginLeft: 'auto' }} icon='refresh' onClick={() => refetch()} />
      </div>
      <List style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        {loading ? (
          <ListItem>Loading</ListItem>
        ) : data ? (
          data.listMods.map(mod => <ModItem key={mod.name} toggleModFN={toggleMod} {...mod} />)
        ) : (
          <ListItem>Error</ListItem>
        )}

        <div className='upload-btn-wrapper'>
          <button className='btn'>Upload a Mod</button>
          <input
            type='file'
            name='myfile'
            required
            onChange={({ target: { validity, files } }: ChangeEvent<HTMLInputElement>) =>
              validity.valid && uploadMod({ variables: { file: files![0] } })
            }
          />
        </div>
      </List>
    </div>
  );
};
