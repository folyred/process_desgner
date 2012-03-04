package com.codeloger.main;

import com.codeloger.core.Picker;

public class StartUp {

	/**
	 * ∆Ù∂Ø¿‡
	 * @param args
	 * void 
	 * @author wx
	 */
	public static void main(String[] args) {
		Picker picker = new Picker();
		try {
			picker.start();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
