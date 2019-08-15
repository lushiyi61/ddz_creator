#!/usr/bin/env python
#-*- coding: utf-8 -*-
import os
import hashlib
import argparse

def file_info(f):
	"""
	获取文件的md5值跟大小
	"""
	with open(f, 'rb') as _file:
		return hashlib.md5(_file.read()).hexdigest(), os.path.getsize(f)

def makeMd5Txt(base_dir, src_path_list, dst_dir, md5_filename):
	def walk_cb(file_info_list, dirname, names):
		for name in names:
			path = os.path.join(dirname, name)
			if os.path.isfile(path):
				md5, size = file_info(path)
				fix_path = path.replace('\\', '/')
				file_info_list.append('%s|%s|%s' % (md5, fix_path, size))

	#这样可以确保写入md5的路径是相对的
	os.chdir(base_dir)

	file_info_list = list()
	for src_path in src_path_list:
		if os.path.isfile(src_path):
			md5, size = file_info(src_path)
			fix_path = src_path.replace('\\', '/')
			file_info_list.append('%S|%s|%s' % (md5, fix_path, size))
		else:
			os.path.walk(src_path, walk_cb, file_info_list)

	md5_file_content = '\n'.join(file_info_list)
	md5_file_path = os.path.join(dst_dir, md5_filename)

	if not os.path.exists(dst_dir):
		os.makedirs(dst_dir)

	with open(md5_file_path, 'w') as f:
		f.write(md5_file_content)

	return True


# def build_parser():
# 	parser = argparse.ArgumentParser()
# 	parser.add_argument('-b', '--base', help = 'base dir', required = True)
# 	parser.add_argument('-s', '--src', help = 'src file/dir, onl relative to base', action = 'append', required = True)
# 	parser.add_argument('-d', '--dst', help = 'dst dir', required = True)
# 	parser.add_argument('-n', '--name', help = 'md5 filename', default = 'md5.txt')
# 	return parser

# def main():
# 	args = build_parser().parse_args()
# 	makeMd5Txt(args.base, args.src, args.dst, args.name)


# if __name__ == '__main__':
# 	main()



