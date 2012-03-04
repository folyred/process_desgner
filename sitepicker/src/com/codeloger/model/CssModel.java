package com.codeloger.model;

public class CssModel extends StaticResourceModel{

	public CssModel(String url) {
		super(url);
	}

	@Override
	public String savePath() {
		return "css";
	}
	
	@Override
	public String getSuffix() {
		return ".css";
	}

}
