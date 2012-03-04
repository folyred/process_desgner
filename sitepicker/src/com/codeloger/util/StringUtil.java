package com.codeloger.util;


/**
 * ������ҪΪΪstring�ĸ�����,һЩ�����ķ���
 */
public class StringUtil {

	/**
	 * �Ƿ�Ϊ��
	 * @param str
	 * @return
	 * @author wx
	 */
	public static boolean notEmpty(Object str) {
		if (str != null && str.toString().trim().length() > 0) {
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * ��ȡ�ַ������������ض��ַ�
	 * @param str
	 * @param aChar
	 * @return
	 * @author wx
	 */
	public static int getCharacterCount(String str, String aChar){
		int index = str.indexOf(aChar);
		int count = 0;
		while(index >= 0){
			count ++;
			index = str.indexOf(aChar, index + 1);
		}
		return count;
	}

}
