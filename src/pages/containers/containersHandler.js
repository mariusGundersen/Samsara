import qvc from 'qvc';
import samsara from 'samsara-lib';

export default [
  qvc.command('stopContainer', async function(command){
    await samsara().container(command.id).stop();
  }),
  qvc.command('startContainer', async function(command){
    await samsara().container(command.id).start();
  }),
  qvc.command('removeContainer', async function(command){
    await samsara().container(command.id).remove();
  }),
  qvc.command('restartContainer', async function(command){
    await samsara().container(command.id).restart();
  })
];
