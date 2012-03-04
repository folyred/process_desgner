package com.codeloger.model;

public class ImageModel extends StaticResourceModel {

	public ImageModel(String url) {
		super(url);
	}

	@Override
	public String savePath() {
		return "image";
	}

	@Override
	public String getSuffix() {
		return ".png";
	}
	
}
