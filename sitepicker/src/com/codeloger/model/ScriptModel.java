package com.codeloger.model;

public class ScriptModel extends StaticResourceModel{

	public ScriptModel(String url) {
		super(url);
	}

	@Override
	public String savePath() {
		return "js";
	}
	
	@Override
	public String getSuffix() {
		return ".js";
	}

}
