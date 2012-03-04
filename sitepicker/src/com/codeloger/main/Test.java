package com.codeloger.main;

import java.io.File;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;

import com.codeloger.util.HttpUtil;
import com.codeloger.util.StringUtil;

public class Test {

	/**
	 * <li>功能描述：本方法的功能描述。
	 * @param args
	 * void 
	 * @author wx
	 */
	public static void main(String[] args) {
		String s = "http://www.actionsoft.com.cn/index/";
		String res = "images/1.png";
		System.out.println(HttpUtil.getResourceStaticUrl(s, res));
	}

}
