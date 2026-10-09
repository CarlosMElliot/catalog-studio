from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
root=Path(__file__).resolve().parent.parent
excluded={'node_modules','.git','.openai','.sites-runtime','dist','.wrangler','.next','.vinext','outputs','work','.agents','.codex'}
with ZipFile(root/'public/source-code.zip','w',ZIP_DEFLATED,compresslevel=6) as z:
 for path in root.rglob('*'):
  relative=path.relative_to(root)
  if not path.is_file() or any(part in excluded for part in relative.parts) or path.name in {'source-code.zip','tsconfig.tsbuildinfo'} or path.name.startswith('.env'):continue
  z.write(path,'nova-catalog-studio/'+str(relative))
 z.writestr('nova-catalog-studio/.openai/hosting.json','{\n  \"d1\": null,\n  \"r2\": null\n}\n')
print('Source ZIP:',(root/'public/source-code.zip').stat().st_size,'bytes')
