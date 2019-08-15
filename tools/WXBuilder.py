#!/usr/bin/env python
# -*- coding: utf-8 -*-

# '''
#
# eg: python PublishWeChatGame.py -m test -r 703 -c CN_WEB_WECHAT
# 有以下参数
# -m 环境配置 dev开发环境内网测试 test外网测试 pro发布版本
# -r 资源版本号 如果不设置每次执行，配置中的资源版本号都会+1
# -c 渠道号 默认CN_WEB_WECHAT
# -s 要执行哪几步  1只修改配置 2发布并打包 默认0发布并打包
# -a 自动增加资源版本号 0不自动 1自动 默认0
#
# '''

import os
import os.path
import sys
import argparse
import shutil
import re
import urllib
import urllib2
import json
import hashlib
import zipfile
import time
import pip
import pdb
import json
# import make_md5
from subprocess import check_output

class RemoveSpaceClass(object):
	"""docstring for RemoveSpaceClass"""
	def __init__(self):
		super(RemoveSpaceClass, self).__init__()

	def remove_space_and_saveas(self, filename, src, dst):
		os.chdir(src)

		content = ""
		with open(filename, 'r') as file:
			while True:
				line = file.readline()
				if not line:
					break

				line = line.strip()
				content = content + line

			file.close()

		dst_file = os.path.join(dst, filename)
		output = open(dst_file, 'w')
		output.write(content)
		output.close()

	def judge_extension(self, filename):
		ext = os.path.splitext(filename)
		if ext[1] == ".json" or ext[1] == ".ExportJson" or ext[1] == ".plist":
			return True

		return False

	def check_directory(self, dst):
		if not os.path.isdir(dst):
			os.mkdir(dst)

	def check_and_remove(self, filename, src, dst):
		if not self.judge_extension(filename):
			return

		src_file = os.path.join(src, filename)
		if os.path.isfile(src_file):
			self.remove_space_and_saveas(filename, src, dst)

	def main(self, base, src_list, dst):
		os.chdir(base)

		def walk_cb(args, dirname, names):
			for name in names:
				src_file = os.path.join(dirname, name)

				self.check_directory(os.path.join(dst, dirname))

				self.check_and_remove(src_file, base, dst)

		for src in src_list:
			src_path = os.path.join(base, src)
			if os.path.isfile(src_path):
				self.check_and_remove(src, base, dst)
			else:
				os.path.walk(src, walk_cb, ())


class ConfigClass(object):
	"""docstring for ConfigClass"""

	def __init__(self, arg):
		super(ConfigClass, self).__init__()

		self.file_path = "./config.json"
		self.config = ""

		m = self.data_map = {
			"unity_pay_secret": "F0V-]060D~;v=64d8b9LBA0/x>1=I%+g",
			"app_id": "wx0d733b5e0c1d15b1",
			# "offer_id": "1450014278",
			"channel": "CN_WEB_WECHAT",

			"os": "web",
			"lang": "cn",
			"nick": "nick",
			"debug": True,
			"uin": 87,
			"device_id": "0000",

			"version": 703,
			"res_version": 703,

			"host_wss": "ws://",
			"host_http": "http://",
			"host_name": "192.168.100.235",
			"download_name": "192.168.100.235",
			"upload_stat_name": "192.168.100.235:16901/stat/event_track",
			"host_pay_name": "http://texas-test.qfighting.com/webpay/wx/game/order/create",
			"host_pay_callback": "http://pay-test.qfighting.com/wx/game/pay/cb",
			"socket_ip": "192.168.100.235",
			"socket_port": 29011,

			"hortor_wall_gameid": "qfddz",
			"hortor_wall_key": "qfddz",
			"hortor_gameid": "external_qfddz_test",
			"hortor_secret": "e9a1c2baf83361b3d21dcd345bf7e1d1",
			"upload_hortor_name": "wxlog-test.hortorgames.com/wxlog/api/v1/external/stats",

			"host_res_format": "%s%s/media/wxgame/%s/%s/static/"
		};

		self.mode = "dev"
		if arg.mode != "":
			self.mode = arg.mode

		self.dft_channel = arg.channel
		self.dft_res_version = int(arg.res_version)
		self.dft_version = int(arg.version)
		self.dft_auto = int(arg.auto)
		self.dft_log = int(arg.log);


	def parse(self):
		f = open(self.file_path, 'r')

		m = self.data_map;

		c = self.config = json.load(f)
		m['os'] = c['os']
		m['lang'] = c['lang']
		m['device_id'] = c['device_id'] 
		m['host_res_format'] = c['host_res_format']

		n = c['channel'][m['channel']]
		m['app_id'] = n['app_id']
		m['unity_pay_secret'] = n['unity_pay_secret']
		# m['offer_id'] = n['offer_id']
		m['version'] = n['version']
		m['res_version'] = n['res_version']

		d = c[self.mode]
		m['host_wss'] = d['wss']
		m['host_http'] = d['http']
		m['host_name'] = d['host_name']
		m['download_name'] = d['download_name']
		m['socket_ip'] = d['socket_ip']
		m['socket_port'] = d['socket_port']
		m['upload_stat_name'] = d['upload_stat_name']
		m['host_pay_name'] = d['host_pay_name']
		m['host_pay_callback'] = d['host_pay_callback']
		m['nick'] = d['nick']
		m['debug'] = d['debug']
		m['uin'] = d['uin']

		m['hortor_wall_key'] = d['hortor_wall_key']
		m['hortor_wall_gameid'] = d['hortor_wall_gameid']
		m['hortor_gameid'] = d['hortor_gameid']
		m['hortor_secret'] = d['hortor_secret']
		m['upload_hortor_name'] = d['upload_hortor_name']

		if self.dft_channel != "":
			m['channel'] = self.dft_channel

		if self.dft_res_version != -1:
			m['res_version'] = self.dft_res_version

		if self.dft_version != -1:
			m['version'] = self.dft_version

		f.close()
	

	def save(self):
		print "Modify GameConfig"

		dst_file = "../assets/scripts/config/GameConfig.js"
		dst_str = "let config = {};\n"

		keys = self.data_map.keys()
		keys.sort()

		for index in range(len(keys)):
			key = keys[index]
			value = self.data_map[key]

			dst_str += '\nconfig.' + key.upper()
			if isinstance(value, (int, bool, float)):
				dst_str += " = " + str(value).lower()
			else:
				dst_str += " = \"" + value + "\""
			dst_str += ";"

		dst_str += "\nexport default config\n";

		f = open(dst_file, 'w')
		f.write(dst_str)
		f.close()

		m = self.data_map

		if self.dft_auto == 1:
			self.config['channel'][m['channel']]['res_version'] = m['res_version'] + 1

		f = open(self.file_path, 'w')
		f.write(json.dumps(self.config, indent=4, sort_keys=True))
		f.close()


	def get_server_url(self):
		m = self.data_map

		server_url = m['host_res_format'] % (m['host_http'], m['download_name'], m['channel'], str(m['res_version']))

		return server_url


	def get_file_lines(self, fp):
		fp = os.path.abspath(fp)

		f = open(fp)
		lines = f.readlines()
		f.close()

		return lines


	def modify_server_url(self):
		server_url = self.get_server_url()

		game_js_file = os.path.abspath("../build/wechatgame/game.js")

		lines = self.get_file_lines(game_js_file)

		index = -1
		found_index = -1
		for line in lines:
			index = index + 1
			start_pos = line.find("wxDownloader.REMOTE_SERVER_ROOT")
			if start_pos == 0:
				found_index = index
				break

		if found_index != -1:
			line = lines[found_index]
			span = re.search('".+"', line).span()
			new_line = line.replace(line[span[0]+1:span[1]-1], server_url.encode("utf-8"))
			lines[found_index] = new_line

			f = open(game_js_file, 'w')
			f.writelines(lines)
			f.close()

	#临时处理，修改project.json的debugMode和showFPS
	def modify_project(self):
		file_path = "../project.json"
		key_list = ["project_type", "debugMode", "showFPS", "frameRate", "noCache", "id", "renderMode", "engineDir", "modules", "jsList"]

		f = open(file_path, 'r')
		document = json.load(f)

		key_debug_mode = "debugMode"
		key_show_fps = "showFPS" 
		document[key_debug_mode] = self.dft_log
		document[key_show_fps] = bool(self.dft_log)

		content = "{\n"
		first_key = True
		prefix = "\t";
		for name in key_list:
			doc = document[name]
			if not first_key:
				content = content + ",\n"
			first_key = False
			content = content + prefix;

			content = content + ("\"%s\" : " % name)
			if isinstance(doc, str):
				content = content + ("\"%s\"" % doc)
			elif isinstance(doc, bool):
				content = content + ("%s" % str(doc).lower())
			elif isinstance(doc, int):
				content = content + ("%d" % int(doc))
			elif isinstance(doc, list):
				content = content + "[\n"
				is_first = True
				for name in doc:
					if not is_first:
						content = content + ",\n"
					is_first = False
					content = content + prefix + prefix

					content = content + ("\"%s\"" % name)

				content = content + "\n\t]";
			else:
				content = content + ("\"%s\"" % doc)

		content = content + "\n}"

		f.close()

		f = open(file_path, 'w')
		f.write(content)
		f.close()


class UploadClass(object):
	"""docstring for UploadClass"""
	def __init__(self, arg):
		super(UploadClass, self).__init__()

		self.cc = arg

	def get_zip_name(self):

		m = self.cc.data_map

		zip_name = "../" + m['channel'] + "-" + str(m['res_version']) + "-res.zip"

		return zip_name

	def zip(self):

		zip_name = self.get_zip_name()

		self.make_zip(["."], zip_name)

	def make_zip(self, src_list, filename):
		print "Start Zip Res"

		if os.path.exists(filename):
			os.remove(filename)

		zfile = zipfile.ZipFile(filename, 'w')

		def walk_cb(zfile, dirname, names):
			for name in names:
				file_path = os.path.join(dirname, name)
				if os.path.isfile(file_path):
					zfile.write(file_path)

		for src_path in src_list:
			if os.path.isfile(src_path):
				zfile.write(src_path)
			else:
				os.path.walk(src_path, walk_cb, zfile)

		zfile.close()


class WeChatTools(object):
	"""docstring for WeChatTools"""
	def __init__(self):
		super(WeChatTools, self).__init__()

	def open(self):
		os.system("cli.bat -o")

	def close(self):
		os.popen('taskkill /F /IM wechatdevtools.exe').read().decode('cp936')


def copy_files(src, dst):
	if os.path.isfile(src):
		if not os.path.exists(dst):
			os.makedirs(dst);

		shutil.copy(src, dst);
		return

	for name in os.listdir(src):
		abs_path = os.path.join(src, name)
		if os.path.isdir(abs_path):
			sub_dst = os.path.join(dst, name)
			copy_files(abs_path, sub_dst)
		elif os.path.isfile(abs_path):
			if not os.path.exists(dst):
				os.makedirs(dst)

			shutil.copy(abs_path, dst)


def process(args):
	cc = ConfigClass(args)

	cc.parse()

	#修改GameConfig.js文件
	cc.save()

	if int(args.step) == 1:
		return

	wct = WeChatTools()
	#关闭微信开发者工具
	wct.close()

	# cc.modify_project()

	#执行cocos compile
	command_line = 'CocosCreator.exe --path ../ --build "platform=wechatgame;debug=false;autoCompile=true"';
	print os.system(command_line)

	#copy微信lib
	# src_path = os.path.abspath("../wechatgamesources/")
	# dst_path = os.path.abspath("../publish/html5/")
	# copy_files(src_path, dst_path)

	#修改服务器资源url0
	cc.modify_server_url()

	#把当前路径设置为publish/html5
	os.chdir(os.path.abspath("../build/wechatgame/"))

	# RemoveSpaceClass().main(".", ["res"], ".")

	#生成MD5文件
	# make_md5.makeMd5Txt(dst_path, ["res"], dst_path, "md5.txt")

	uc = UploadClass(cc)

	uc.zip()

	#删除publish下res目录
	print "Start Delete Res"
	res_path = os.path.abspath("res")
	shutil.rmtree(res_path)

	# os.chdir(os.path.abspath("../../tools/"))

	#copy Loadding界面资源
	# ld_src_path = os.path.abspath("../res/cn/iloadding/")
	# ld_dst_path = os.path.abspath("../publish/html5/res/cn/iloadding/")
	# copy_files(ld_src_path, ld_dst_path)

	#打开微信开发者工具
	wct.open()

	print "finished"


def build_parser():
	parser = argparse.ArgumentParser()
	parser.add_argument('-m', '--mode', help='mode', default='dev')
	parser.add_argument('-r', '--res_version', help='res_version', default=-1)
	parser.add_argument('-v', '--version', help='version', default=-1)
	parser.add_argument('-c', '--channel', help='channel', default='CN_WEB_WECHAT')
	parser.add_argument('-s', '--step', help='step', default=0)
	parser.add_argument('-a', '--auto', help='auto add res_version', default=0)
	parser.add_argument('-o', '--log', help='log enabled', default=1)

	return parser


def main():
	args = build_parser().parse_args()
	process(args)


if __name__ == '__main__':
	main()
