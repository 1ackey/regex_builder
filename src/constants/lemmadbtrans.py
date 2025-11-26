# convert_lemma_to_js_with_quotes.py
import re

# 输入文件
input_file = 'lemmaDB.txt'
# 输出文件
output_file = 'LEMMA_DB.js'

lemma_db = {}

with open(input_file, 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        # 忽略注释行和空行
        if not line or line.startswith(';'):
            continue
        # 匹配 "lemma -> form1,form2,..."
        match = re.match(r"^(.+?)\s*->\s*(.+)$", line)
        if match:
            lemma = match.group(1).strip()
            forms = match.group(2).split(',')
            # 去重，保留顺序
            forms_list = [lemma] + [f.strip() for f in forms if f.strip() != lemma]
            # 合并已有 lemma（防止重复）
            if lemma in lemma_db:
                existing = lemma_db[lemma]
                for f in forms_list:
                    if f not in existing:
                        existing.append(f)
                lemma_db[lemma] = existing
            else:
                lemma_db[lemma] = forms_list

# 写入 JS 文件，所有 key 都用引号
with open(output_file, 'w', encoding='utf-8') as f:
    f.write("export const LEMMA_DB = {\n")
    for i, (lemma, forms) in enumerate(lemma_db.items()):
        forms_str = ','.join(f'"{x}"' for x in forms)
        # key 加引号
        key_str = f'"{lemma}"'
        comma = ',' if i < len(lemma_db)-1 else ''
        f.write(f"  {key_str}: [{forms_str}]{comma}\n")
    f.write("};\n")

print(f"JS 文件生成完成：{output_file}")
